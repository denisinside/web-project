import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Teacher } from '../../models/teacher.model';
import { AdditionalUser, User } from '../../models/user.model';
import { randomUserMock, additionalUsers } from '../FE4U-Lab2-mock';
import { UserApiService } from './user-api.service';
import _ from 'lodash';

export interface TeacherFilter {
  age: '18-31' | '31-44' | '45+' | '';
  country: string;
  sex: 'Male' | 'Female' | '';
  withPhoto: boolean;
  onlyFavorites: boolean;
  search: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private userApiService = inject(UserApiService);

  private readonly jsonServerUrl = 'http://localhost:3000/teachers';

  private teachersSignal = signal<Teacher[]>([]);
  private selectedTeacherSignal = signal<Teacher | null>(null);
  private isModalVisibleSignal = signal<boolean>(false);

  private currentPageSignal = signal<number>(1);
  private isLoadingSignal = signal<boolean>(false);
  private readonly teachersPerPage = 15;

  private filtersSignal = signal<TeacherFilter>({
    age: '',
    country: '',
    sex: '',
    withPhoto: false,
    onlyFavorites: false,
    search: ''
  });

  teachers = computed(() => this.teachersSignal());
  filters = computed(() => this.filtersSignal());
  statisticsData = computed(() => this.filteredTeachers());
  selectedTeacher = computed(() => this.selectedTeacherSignal());
  isModalVisible = computed(() => this.isModalVisibleSignal());

  currentPage = computed(() => this.currentPageSignal());
  isLoading = computed(() => this.isLoadingSignal());

  paginatedTeachers = computed(() => {
      const filtered = this.filteredTeachers();
      const page = this.currentPageSignal();
      const startIndex = (page - 1) * this.teachersPerPage;
      return _.slice(filtered, startIndex, startIndex + this.teachersPerPage);
  });

  totalPages = computed(() => {
      const total = this.filteredTeachers().length;
      if (total === 0) return 1;
      return Math.ceil(total / this.teachersPerPage);
  });

  availableCountries = computed(() => {
    const teachers = this.teachersSignal();
    return _.chain(teachers)
      .map('country')
      .compact()
      .uniq()
      .sortBy()
      .value();
  });
  
  filteredTeachers = computed(() => {
    const teachers = this.teachersSignal();
    const filters = this.filtersSignal();
    
    let filtered = this.filterUsers(teachers, {
      age: filters.age,
      country: filters.country,
      sex: filters.sex,
      withPhoto: filters.withPhoto,
      onlyFavorites: filters.onlyFavorites
    });

      if (filters.search) {
      const searchResults = this.findUser(filtered, {
        search: filters.search,
      }, true) as Teacher[];
      filtered = searchResults;
    }
    
    return filtered;
  });

  favoriteTeachers = computed(() => 
    _.filter(this.teachersSignal(), { favorite: true })
  );


  updateFilters(newFilters: Partial<TeacherFilter>) {
    this.filtersSignal.update(current => _.assign({}, current, newFilters));
    this.currentPageSignal.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
    }
  }

  previousPage() {
    this.goToPage(this.currentPageSignal() - 1);
  }

  nextPage() {
    const currentPage = this.currentPageSignal();
    const totalPages = this.totalPages();
    if (currentPage < totalPages) {
      this.goToPage(currentPage + 1);
    } else {
      this.loadNextPage();
    }
  }

  toggleFavorite(teacherId: string) {
    this.teachersSignal.update(teachers => 
      _.map(teachers, teacher => 
        teacher.id === teacherId 
          ? { ...teacher, favorite: !teacher.favorite }
          : teacher
      )
    );
  }

  openTeacherModal(teacher: Teacher) {
    this.selectedTeacherSignal.set(teacher);
    this.isModalVisibleSignal.set(true);
  }

  closeTeacherModal() {
    this.isModalVisibleSignal.set(false);
    this.selectedTeacherSignal.set(null);
  }

  toggleFavoriteInModal() {
    const teacher = this.selectedTeacherSignal();
    if (teacher) {
      this.toggleFavorite(teacher.id);
      this.selectedTeacherSignal.set({ ...teacher, favorite: !teacher.favorite });
    }
  }

  addTeacher(newTeacherData: Omit<Teacher, 'id'>) {
    const teacherPayload = _.cloneDeep(newTeacherData);

    this.http.post<Teacher>(this.jsonServerUrl, teacherPayload).subscribe({
      next: (addedTeacher) => {
        this.teachersSignal.update(teachers => _.concat(teachers, addedTeacher));
        console.log('Teacher added successfully via json-server:', addedTeacher);
      },
      error: (error) => {
        console.error('Error adding teacher via json-server:', error);
      }
    });
  }

  getTeacherById(id: string) {
    return computed(() => 
      _.find(this.teachersSignal(), { id })
    );
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}.${lastName.charAt(0)}`;
  }

  private courses = [
    'Mathematics', 'Physics', 'English', 'Computer Science', 
    'Dancing', 'Chess', 'Biology', 'Chemistry', 
    'Law', 'Art', 'Medicine', 'Statistics'
];

  private bgColors =  ['#1f75cb', '#dface7', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  getRandomID() : string {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  getRandomCourse() : string {
    return _.sample(this.courses) || 'Mathematics';
  } 

  getRandomBgColor() : string | null {
    return Math.random() > 0.3 ? _.sample(this.bgColors) || null : null;
  }

  getFormattedGender(gender: string) : string | null {
    return gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : null;
  }

  userFormatter(user: User | AdditionalUser): Teacher {
    if ('name' in user) {
      return {
        gender: this.getFormattedGender(user.gender) || null,
        title: user.name?.title || null,
        full_name: user.name ? `${user.name.first} ${user.name.last}` : null,
        city: user.location?.city || null,
        state: user.location?.state || null,
        country: user.location?.country || null,
        postcode: user.location?.postcode || null,
        coordinates: user.location?.coordinates || null,
        timezone: user.location?.timezone || null,
        email: user.email || null,
        b_date: user.dob?.date || null,
        age: user.dob?.age || null,
        phone: user.phone ? this.formatPhone(user.phone) : null,
        picture_large: user.picture?.large || null,
        picture_thumbnail: user.picture?.thumbnail || null,
        id: this.getRandomID(),
        favorite: Math.random() > 0.5,
        course: this.getRandomCourse(),
        bg_color: this.getRandomBgColor(),
        note: null
      };
    } else {
      return {
        gender: this.getFormattedGender(user.gender) || null,
        title: user.title || null,
        full_name: user.full_name || null,
        city: user.city || null,
        state: user.state || null,
        country: user.country || null,
        postcode: user.postcode || null,
        coordinates: user.coordinates || null,
        timezone: user.timezone || null,
        email: user.email || null,
        b_date: user.b_day || null,
        age: user.age || null,
        phone: user.phone ? this.formatPhone(user.phone) : null,
        picture_large: user.picture_large || null,
        picture_thumbnail: user.picture_thumbnail || null,
        id: this.getRandomID(),
        favorite: user.favorite !== undefined ? Boolean(user.favorite) : Math.random() > 0.5,
        course: user.course || this.getRandomCourse(),
        bg_color: user.bg_color !== undefined ? user.bg_color : this.getRandomBgColor(),
        note: user.note || null
    };
    }
  }

  isDuplicate(user1: Teacher, user2: Teacher) : boolean {
    if (user1.email && user2.email && user1.email === user2.email) {
        return true;
    }
    if (user1.full_name && user2.full_name && user1.full_name === user2.full_name) {
        return true;
    }
    return false;
  }

  removeDuplicates(users: Teacher[]) {
    return _.uniqWith(users, (user1, user2) => this.isDuplicate(user1, user2));
  }

  formatMockData(): Teacher[] {
    try {
        const formattedRandomUsers = _.map(randomUserMock, user => this.userFormatter(user));
        const formattedAdditionalUsers = _.map(additionalUsers, user => this.userFormatter(user));
        const allUsers = _.concat(formattedRandomUsers, formattedAdditionalUsers);
        return this.removeDuplicates(allUsers);
    } catch (error) {
        console.error('Error formatting mock data:', error);
        return [];
    }
  }

  filterUsers(users: Teacher[], filters: Partial<TeacherFilter>): Teacher[] {
    if (!_.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    return _.filter(users, user => {
        if (!_.isEmpty(filters.country) && filters.country !== '') {
            if (user.country !== filters.country) return false;
        }

        if (!_.isEmpty(filters.age) && filters.age !== '') {
            if (!user.age) return false;
            
            const age = user.age;
            if (filters.age === '18-31' && !_.inRange(age, 18, 32)) return false;
            if (filters.age === '31-44' && !_.inRange(age, 31, 45)) return false;
            if (filters.age === '45+' && age < 45) return false;
        }

        if (!_.isEmpty(filters.sex) && filters.sex !== '') {
            if (!user.gender || user.gender !== filters.sex) return false;
        }

        if (filters.onlyFavorites === true) {
            if (user.favorite !== filters.onlyFavorites) return false;
        }

        if (filters.withPhoto) {
            if (!user.picture_large) return false;
        }

        return true;
    });
  }

  sortUsers(users: Teacher[], sortBy: string, order: 'asc' | 'desc' = 'asc'): Teacher[] {
    if (!_.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    const validSortFields = ['full_name', 'age', 'b_date', 'country', 'gender', 'course'];
    if (!_.includes(validSortFields, sortBy)) {
        console.error(`Invalid sort field. Use one of: ${validSortFields.join(', ')}`);
        return [...users];
    }

    const validOrders = ['asc', 'desc'];
    if (!_.includes(validOrders, order.toLowerCase())) {
        console.error(`Invalid sort order. Use 'asc' or 'desc'`);
        return [...users];
    }

    // Custom iteratee for handling different field types
    const iteratee = (user: Teacher) => {
        const value = user[sortBy as keyof Teacher];
        
        if (_.isNil(value)) return '';
        
        switch (sortBy) {
            case 'full_name':
            case 'course':
            case 'gender':
            case 'country':
                return _.toLower(_.toString(value));
            
            case 'age':
                return _.toNumber(value) || 0;
            
            case 'b_date':
                return new Date(value as string).getTime() || 0;
            
            default:
                return _.toLower(_.toString(value));
        }
    };

    return _.orderBy(users, [iteratee], [order]);
  }

  findUser(users: Teacher[], searchParams: Partial<TeacherFilter>, findAll: boolean = true): Teacher[] | Teacher | null {
    if (!_.isArray(users)) {
        console.error('First parameter must be an array');
        return findAll ? [] : null;
    }

    const results: Teacher[] = _.filter(users, user => {
        if (!_.isEmpty(searchParams.search)) {
            const searchValue = _.toLower(_.toString(searchParams.search));

            if (!user.full_name) return false;

            const nameMatch = _.includes(_.toLower(user.full_name), searchValue);
            const ageMatch = !_.isNil(user.age) && _.includes(_.toString(user.age), searchValue);
            const noteMatch = user.note && _.includes(_.toLower(user.note), searchValue);

            return nameMatch || ageMatch || noteMatch;
        }

        return true;
    }) as Teacher[];

    return findAll ? results : (results.length > 0 ? results[0] : null);
  }

  getMatchingPercentage(users: Teacher[], searchParams: Partial<TeacherFilter>): number {
    const matchingCount = (this.findUser(users, searchParams, true) as Teacher[]).length;
    const totalCount = users.length;
    return Math.round((matchingCount / totalCount) * 100);
  }

  validateNameValue(name: string) {
    return typeof name === 'string' && name.length > 0 && name.charAt(0).toUpperCase() === name.charAt(0);
  }

  validateAge(age: number) {
    return typeof age === 'number' && age > 0 && age < 150;
  }

  validatePhone(phone: string) {
    if (typeof phone !== 'string' || !phone.trim()) {
      return false;
    }
    
    const cleanedPhone = phone.replace(/[\s\-\(\)\.\+\/]/g, '');
    
    if (!/^\d+$/.test(cleanedPhone)) {
      return false;
    }
    
    return cleanedPhone.length >= 6 && cleanedPhone.length <= 15;
  }

  formatPhone(phone: string): string {
    if (!this.validatePhone(phone)) {
      return phone;
    }
    
    const cleanedPhone = phone.replace(/[\s\-\(\)\.\+\/]/g, '');
    
    if (cleanedPhone.length === 10) {
      // (XXX) XXX-XXXX
      return `(${cleanedPhone.slice(0, 3)}) ${cleanedPhone.slice(3, 6)}-${cleanedPhone.slice(6)}`;
    } else if (cleanedPhone.length >= 6 && cleanedPhone.length <= 15) {
      // spaces every 3 digits
      return cleanedPhone.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    }
    
    return phone; 
  }

  validateEmail(email: string) {
    return typeof email === 'string' && email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

validateUser(user: Teacher) {
    const validations = [
      { condition: user.full_name, validator: () => this.validateNameValue(user.full_name!) },
      { condition: user.gender, validator: () => this.validateNameValue(user.gender!) },
      { condition: user.note, validator: () => this.validateNameValue(user.note!) },
      { condition: user.state, validator: () => this.validateNameValue(user.state!) },
      { condition: user.city, validator: () => this.validateNameValue(user.city!) },
      { condition: user.country, validator: () => this.validateNameValue(user.country!) },
      { condition: user.age, validator: () => this.validateAge(user.age!) },
      { condition: user.phone, validator: () => this.validatePhone(user.phone!) },
      { condition: user.email, validator: () => this.validateEmail(user.email!) }
    ];

    return _.every(validations, ({ condition, validator }) => 
      !condition || validator()
    );
  }


  initializeTeachers(): void {
    this.collectNewTeachers(45, []);
  }

  private async initializeWithMockData(): Promise<void> {
    try {
      const formattedUsers = this.formatMockData();
      const validUsers = _.filter(formattedUsers, user => this.validateUser(user));
      this.teachersSignal.set(validUsers);
      console.log(`Initialized ${validUsers.length} valid teachers from mock data only`);
    } catch (error) {
      console.error('Error initializing teachers with mock data:', error);
      this.teachersSignal.set([]);
    }
  }

  private collectNewTeachers(needed: number, collected: Teacher[], page: number = 1): void {
    if (needed <= 0) {
      this.teachersSignal.update(existing => _.concat(existing, collected));
      this.currentPageSignal.set(page);
      this.isLoadingSignal.set(false);
      return;
    }

    const fetchCount = _.max([needed, 15])!;

    this.userApiService.getUsersWithParams({ results: fetchCount }).subscribe({
      next: apiUsers => {
        if (_.isEmpty(apiUsers)) {
          console.warn("API returned no users, stopping load more.");
          if (!_.isEmpty(collected)) {
            this.teachersSignal.update(existing => _.concat(existing, collected));
            this.currentPageSignal.set(page);
          }
          this.isLoadingSignal.set(false);
          return;
        }

        const formattedUsers = _.map(apiUsers, user => this.userFormatter(user));
        const validUsers = _.filter(formattedUsers, user => this.validateUser(user));

        let stillNeeded = needed;
        for (const user of validUsers) {
          const isDuplicate = _.some(this.teachersSignal(), existing => this.isDuplicate(user, existing)) ||
            _.some(collected, existing => this.isDuplicate(user, existing));
          if (!isDuplicate) {
            collected.push(user);
            stillNeeded--;
            if (stillNeeded === 0) break;
          }
        }

        if (stillNeeded > 0 && apiUsers.length < fetchCount) {
          if (!_.isEmpty(collected)) {
            this.teachersSignal.update(existing => _.concat(existing, collected));
            this.currentPageSignal.set(page);
          }
          this.isLoadingSignal.set(false);
          return;
        }

        this.collectNewTeachers(stillNeeded, collected, page);
      },
      error: err => {
        console.error('Failed to fetch more users:', err);
        this.isLoadingSignal.set(false);
      }
    });
  };

  private loadNextPage(): void {
    if (this.isLoadingSignal()) return;
    this.isLoadingSignal.set(true);

    this.collectNewTeachers(this.teachersPerPage, [], this.currentPageSignal() + 1);
  }
}