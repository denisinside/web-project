import { Injectable, signal, computed } from '@angular/core';
import { Teacher } from '../../models/teacher.model';

export interface TeacherFilter {
  age: '18-31' | '31-44' | '45+' | '';
  region: 'Europe' | 'Asia' | 'America' | 'Africa' | 'Australia and Oceania' | '';
  sex: 'Male' | 'Female' | '';
  withPhoto: boolean;
  onlyFavorites: boolean;
  search: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private teachersSignal = signal<Teacher[]>([
    {
      id: 1,
      firstName: 'Ihor',
      lastName: 'Tkachuk',
      specialty: 'Chemistry',
      country: 'Ukraine',
      city: 'Kyiv',
      age: 35,
      gender: 'Male',
      email: 'ihor_tkachuk@domain.com',
      phone: '+380964993252',
      photoUrl: 'assets/images/teacher-man-ukr.jpg',
      isFavorite: true
    },
    {
      id: 2,
      firstName: 'Pragg',
      lastName: 'Rameshbabu',
      specialty: 'Chess',
      country: 'India',
      city: 'Chennai',
      age: 22,
      gender: 'Male',
      email: 'pragg@chess.com',
      phone: '+91987654321',
      photoUrl: 'assets/images/teacher-man-india.jpg',
      isFavorite: false
    },
    {
      id: 3,
      firstName: 'Floor',
      lastName: 'Jansen',
      specialty: 'Vocal',
      country: 'Denmark',
      city: 'Copenhagen',
      age: 42,
      gender: 'Female',
      email: 'floor@nightwish.com',
      phone: '+4512345678',
      photoUrl: 'assets/images/teacher-wowan-denmark.jpg',
      isFavorite: true
    },
    {
      id: 4,
      firstName: 'John',
      lastName: 'Burke',
      specialty: 'Computer Science',
      country: 'Belgium',
      city: 'Brussels',
      age: 38,
      gender: 'Male',
      email: 'john.burke@tech.be',
      phone: '+32123456789',
      photoUrl: 'assets/images/teacher-man-belgium.jpg',
      isFavorite: true
    },
    {
      id: 5,
      firstName: 'Ari',
      lastName: 'Tang',
      specialty: 'Biology',
      country: 'China',
      city: 'Beijing',
      age: 31,
      gender: 'Female',
      email: 'ari.tang@bio.cn',
      phone: '+861234567890',
      photoUrl: 'assets/images/teacher-woman-china.jpg',
      isFavorite: true
    },
    {
      id: 6,
      firstName: 'Rachel',
      lastName: 'Andrew',
      specialty: 'Medicine',
      country: 'UK',
      city: 'London',
      age: 34,
      gender: 'Female',
      email: 'rachel.andrew@med.uk',
      phone: '+441234567890',
      photoUrl: 'assets/images/teacher-woman-uk.jpg',
      isFavorite: false
    },
    {
      id: 7,
      firstName: 'Anna',
      lastName: 'Muzychuk',
      specialty: 'Chess',
      country: 'Belarus',
      city: 'Minsk',
      age: 33,
      gender: 'Female',
      email: 'anna.muzychuk@chess.by',
      phone: '+375123456789',
      photoUrl: '',
      isFavorite: true
    },
    {
      id: 8,
      firstName: 'Radoslaw',
      lastName: 'Ljuboevic',
      specialty: 'Physics',
      country: 'Poland',
      city: 'Warsaw',
      age: 47,
      gender: 'Male',
      email: 'radoslaw@physics.pl',
      phone: '+48123456789',
      photoUrl: '',
      isFavorite: false
    }
  ]);

  private filtersSignal = signal<TeacherFilter>({
    age: '',
    region: '',
    sex: '',
    withPhoto: false,
    onlyFavorites: false,
    search: ''
  });


  private statisticsDataSignal = signal([
    {
      id: 101,
      firstName: 'Daisy',
      lastName: 'Alexander',
      specialty: 'Chemistry',
      age: 28,
      gender: 'Female' as const,
      country: 'Vietnam'
    },
    {
      id: 102,
      firstName: 'Julia',
      lastName: 'Bradley',
      specialty: 'Math',
      age: 26,
      gender: 'Female' as const,
      country: 'USA'
    },
    {
      id: 103,
      firstName: 'Rita',
      lastName: 'Hart',
      specialty: 'Art',
      age: 41,
      gender: 'Female' as const,
      country: 'Ireland'
    },
    {
      id: 104,
      firstName: 'Jonathan',
      lastName: 'Jacobs',
      specialty: 'Math',
      age: 32,
      gender: 'Male' as const,
      country: 'England'
    },
    {
      id: 105,
      firstName: 'Nathaniel',
      lastName: 'White',
      specialty: 'Computer Science',
      age: 37,
      gender: 'Male' as const,
      country: 'Austria'
    },
    {
      id: 106,
      firstName: 'Frank',
      lastName: 'Medina',
      specialty: 'English',
      age: 43,
      gender: 'Male' as const,
      country: 'Italy'
    },
    {
      id: 107,
      firstName: 'Ella',
      lastName: 'Curtis',
      specialty: 'Chess',
      age: 34,
      gender: 'Female' as const,
      country: 'USA'
    },
    {
      id: 108,
      firstName: 'Claire',
      lastName: 'Simmons',
      specialty: 'Art',
      age: 38,
      gender: 'Female' as const,
      country: 'Netherlands'
    },
    {
      id: 109,
      firstName: 'Benjamin',
      lastName: 'Knight',
      specialty: 'Biology',
      age: 44,
      gender: 'Male' as const,
      country: 'Scotland'
    },
    {
      id: 110,
      firstName: 'Norma',
      lastName: 'Rose',
      specialty: 'Statistics',
      age: 36,
      gender: 'Female' as const,
      country: 'France'
    }
  ]);


  teachers = computed(() => this.teachersSignal());
  filters = computed(() => this.filtersSignal());
  statisticsData = computed(() => this.statisticsDataSignal());
  
  filteredTeachers = computed(() => {
    const teachers = this.teachersSignal();
    const filters = this.filtersSignal();
    
    return teachers.filter(teacher => {

      if (filters.age) {
        const age = teacher.age;
        if (filters.age === '18-31' && (age < 18 || age > 31)) return false;
        if (filters.age === '31-44' && (age < 31 || age > 44)) return false;
        if (filters.age === '45+' && age < 45) return false;
      }
      

      if (filters.region) {
        const countryRegions: Record<string, string> = {
          'Ukraine': 'Europe',
          'Denmark': 'Europe',
          'Belgium': 'Europe',
          'Belarus': 'Europe',
          'UK': 'Europe',
          'Poland': 'Europe',
          'India': 'Asia',
          'China': 'Asia'
        };
        
        if (countryRegions[teacher.country] !== filters.region) return false;
      }
      

      if (filters.sex && teacher.gender !== filters.sex) return false;
      

      if (filters.withPhoto && !teacher.photoUrl) return false;
      

      if (filters.onlyFavorites && !teacher.isFavorite) return false;
      

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        if (!fullName.includes(searchTerm) && 
            !teacher.age.toString().includes(searchTerm)) return false;
      }
      
      return true;
    });
  });

  favoriteTeachers = computed(() => 
    this.teachersSignal().filter(teacher => teacher.isFavorite)
  );


  updateFilters(newFilters: Partial<TeacherFilter>) {
    this.filtersSignal.update(current => ({ ...current, ...newFilters }));
  }

  toggleFavorite(teacherId: number) {
    this.teachersSignal.update(teachers => 
      teachers.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, isFavorite: !teacher.isFavorite }
          : teacher
      )
    );
  }

  addTeacher(newTeacher: Omit<Teacher, 'id'>) {
    const maxId = Math.max(...this.teachersSignal().map(t => t.id));
    const teacher: Teacher = {
      ...newTeacher,
      id: maxId + 1
    };
    
    this.teachersSignal.update(teachers => [...teachers, teacher]);
  }

  getTeacherById(id: number) {
    return computed(() => 
      this.teachersSignal().find(teacher => teacher.id === id)
    );
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}.${lastName.charAt(0)}`;
  }
}