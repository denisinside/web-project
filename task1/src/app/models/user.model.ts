export interface User {
  gender: string;
  name: Name;
  location: Location;
  email: string;
  login: Login;
  dob: Dob;
  registered: Registered;
  phone: string;
  cell: string;
  id: Id;
  picture: Picture;
  nat: string;
}

export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Location {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: number | string;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Street {
  number: number;
  name: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface Dob {
  date: string;
  age: number;
}

export interface Registered {
  date: string;
  age: number;
}

export interface Id {
  name: string;
  value: string | null;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface AdditionalUser {
  gender: string;
  title: string;
  full_name: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: number | string;
  coordinates?: {
    latitude: string;
    longitude: string;
  };
  timezone?: {
    offset: string;
    description: string;
  };
  email?: string;
  b_day?: string;
  age?: number;
  phone?: string;
  picture_large?: string;
  picture_thumbnail?: string;
  id: string;
  favorite: boolean | null;
  course: string | null;
  bg_color: string | null;
  note: string | null;
}