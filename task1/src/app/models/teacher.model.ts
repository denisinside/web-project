export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    specialty: string;
    country: string;
    city: string;
    age: number;
    gender: 'Male' | 'Female';
    email: string;
    phone: string;
    photoUrl: string;
    isFavorite: boolean;
  }