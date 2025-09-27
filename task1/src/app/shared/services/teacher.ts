import {computed, Injectable, signal} from '@angular/core';
import {Teacher} from '../../models/teacher.model';
import {AdditionalUser, User} from '../../models/user.model';
import {additionalUsers, randomUserMock} from '../FE4U-Lab2-mock';

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
  private teachersSignal = signal<Teacher[]>([]);
  private selectedTeacherSignal = signal<Teacher | null>(null);
  private isModalVisibleSignal = signal<boolean>(false);

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
  statisticsData = computed(() => this.teachersSignal());
  selectedTeacher = computed(() => this.selectedTeacherSignal());
  isModalVisible = computed(() => this.isModalVisibleSignal());

  availableCountries = computed(() => {
    const teachers = this.teachersSignal();
    const countries = [...new Set(teachers.map(teacher => teacher.country).filter(Boolean))];
    return countries.sort();
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
        filtered = this.findUser(filtered, {
        search: filters.search,
      }, true) as Teacher[];
    }

    return filtered;
  });

  favoriteTeachers = computed(() =>
    this.teachersSignal().filter(teacher => teacher.favorite)
  );


  updateFilters(newFilters: Partial<TeacherFilter>) {
    this.filtersSignal.update(current => ({ ...current, ...newFilters }));
  }

  toggleFavorite(teacherId: string) {
    this.teachersSignal.update(teachers =>
      teachers.map(teacher =>
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

  addTeacher(newTeacher: Omit<Teacher, 'id'>) {
    const teacher: Teacher = {
      ...newTeacher,
      id: this.getRandomID()
    };

    this.teachersSignal.update(teachers => [...teachers, teacher]);
  }

  getTeacherById(id: string) {
    return computed(() =>
      this.teachersSignal().find(teacher => teacher.id === id)
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
    return this.courses[Math.floor(Math.random() * this.courses.length)];
  }

  getRandomBgColor() : string | null {
    return Math.random() > 0.3 ? this.bgColors[Math.floor(Math.random() * this.bgColors.length)] : null;
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
        phone: user.phone || null,
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
        phone: user.phone || null,
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
    const uniqueUsers: Teacher[] = [];

    for (const user of users) {
        const isExisting = uniqueUsers.some(existingUser => this.isDuplicate(user, existingUser));
        if (!isExisting) {
            uniqueUsers.push(user);
        }
    }

    return uniqueUsers;
  }

  formatMockData(): Teacher[] {
    try {
        const formattedRandomUsers = randomUserMock.map(user => this.userFormatter(user));
        const formattedAdditionalUsers = additionalUsers.map(user => this.userFormatter(user));
        const allUsers = [...formattedRandomUsers, ...formattedAdditionalUsers];
        const uniqueUsers = this.removeDuplicates(allUsers);
        return uniqueUsers;

    } catch (error) {
        console.error('Error formatting mock data:', error);
        return [];
    }
  }

  filterUsers(users: Teacher[], filters: Partial<TeacherFilter>): Teacher[] {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    return users.filter(user => {
        if (filters.country !== undefined && filters.country !== '') {
            if (user.country !== filters.country) return false;
        }

        if (filters.age !== undefined && filters.age !== '') {
            if (!user.age) return false;

            const age = user.age;
            if (filters.age === '18-31' && (age < 18 || age > 31)) return false;
            if (filters.age === '31-44' && (age < 31 || age > 44)) return false;
            if (filters.age === '45+' && age < 45) return false;
        }

        if (filters.sex !== undefined && filters.sex !== '') {
            if (!user.gender || user.gender !== filters.sex) return false;
        }

        if (filters.onlyFavorites !== undefined && filters.onlyFavorites === true) {
            if (user.favorite !== filters.onlyFavorites) return false;
        }

        if (filters.withPhoto !== undefined) {
            if (filters.withPhoto && !user.picture_large) return false;
        }

        return true;
    });
  }

  sortUsers(users: Teacher[], sortBy: string, order: 'asc' | 'desc' = 'asc'): Teacher[] {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    const validSortFields = ['full_name', 'age', 'b_date', 'country', 'gender', 'course'];
    if (!validSortFields.includes(sortBy)) {
        console.error(`Invalid sort field. Use one of: ${validSortFields.join(', ')}`);
        return [...users];
    }

    const validOrders = ['asc', 'desc'];
    if (!validOrders.includes(order.toLowerCase())) {
        console.error(`Invalid sort order. Use 'asc' or 'desc'`);
        return [...users];
    }

    const sortedUsers = [...users];

    return sortedUsers.sort((a, b) => {
        let valueA = a[sortBy as keyof Teacher];
        let valueB = b[sortBy as keyof Teacher];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return order === 'asc' ? 1 : -1;
        if (valueB == null) return order === 'asc' ? -1 : 1;

        switch (sortBy) {
            case 'full_name':
            case 'course':
            case 'gender':
            case 'country':
                valueA = valueA.toString().toLowerCase();
                valueB = valueB.toString().toLowerCase();
                break;

            case 'age':
                valueA = Number(valueA);
                valueB = Number(valueB);

                if (isNaN(valueA) && isNaN(valueB)) return 0;
                if (isNaN(valueA)) return order === 'asc' ? 1 : -1;
                if (isNaN(valueB)) return order === 'asc' ? -1 : 1;
                break;

            case 'b_date':
                const dateA = new Date(valueA as string);
                const dateB = new Date(valueB as string);

                if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                if (isNaN(dateA.getTime())) return order === 'asc' ? 1 : -1;
                if (isNaN(dateB.getTime())) return order === 'asc' ? -1 : 1;

                valueA = dateA.getTime();
                valueB = dateB.getTime();
                break;

            default:
                valueA = valueA.toString().toLowerCase();
                valueB = valueB.toString().toLowerCase();
        }

        let comparison = 0;
        if (valueA > valueB) {
            comparison = 1;
        } else if (valueA < valueB) {
            comparison = -1;
        }

        return order === 'desc' ? -comparison : comparison;
    });
  }

  findUser(users: Teacher[], searchParams: Partial<TeacherFilter>, findAll: boolean = true): Teacher[] | Teacher | null {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return findAll ? [] : null;
    }

    const results = users.filter(user => {
        if (searchParams.search && searchParams.search !== '') {
            const searchValue = searchParams.search.toString().toLowerCase();

            if (!user.full_name) return false;

            const nameMatch = user.full_name.toLowerCase().includes(searchValue);
            const ageMatch = user.age !== undefined && user.age !== null && user.age.toString().includes(searchValue);
            const noteMatch = user.note && user.note.toString().toLowerCase().includes(searchValue);

            if (!nameMatch && !ageMatch && !noteMatch) return false;
        }

        return true;
    });

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
    return typeof phone === 'string' && phone.match(/^[\+]?[0-9]{0,3}[\W]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
  }

  validateEmail(email: string) {
    return typeof email === 'string' && email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

validateUser(user: Teacher) {
    if(user.full_name && !this.validateNameValue(user.full_name)) {
        return false;
    }
    if(user.gender && !this.validateNameValue(user.gender)) {
         return false;
    }
    if(user.note && !this.validateNameValue(user.note)) {
        return false;
    }
    if(user.state && !this.validateNameValue(user.state)) {
        return false;
    }
    if(user.city && !this.validateNameValue(user.city)) {
        return false;
    }
    if(user.country && !this.validateNameValue(user.country)) {
        return false;
    }
    if(user.age && !this.validateAge(user.age)) {
        return false;
    }
    if(user.phone && !this.validatePhone(user.phone)) {
        return false;
    }
    if(user.email && !this.validateEmail(user.email)) {
        return false;
    }
    return true;
  }


  initializeTeachers(): void {
    try {
        const formattedUsers = this.formatMockData();
        const validUsers = formattedUsers.filter(user => this.validateUser(user));
        this.teachersSignal.set(validUsers);
        console.log(`Initialized ${validUsers.length} valid teachers`);
    } catch (error) {
        console.error('Error initializing teachers:', error);
        this.teachersSignal.set([]);
    }
  }

}
