export interface Teacher {
    gender: string | null;
    title: string | null;
    full_name: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postcode: number | string | null;
    coordinates: {
        latitude: string;
        longitude: string;
    } | null;
    timezone: {
        offset: string;
        description: string;
    } | null;
    email: string | null;
    b_date: string | null;
    age: number | null;
    phone: string | null;
    picture_large: string | null;
    picture_thumbnail: string | null;
    id: string;
    favorite: boolean;
    course: string | null;
    bg_color: string | null;
    note: string | null;
}