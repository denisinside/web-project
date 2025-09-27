import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../../models/user.model';

export interface RandomUserResponse {
  results: User[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly API_URL = 'https://randomuser.me/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<RandomUserResponse>(`${this.API_URL}/?results=50`).pipe(
      map(response => {
        if (response && response.results) {
          return response.results;
        }
        throw new Error('Invalid response format');
      }),
      catchError(error => {
        console.error('Error fetching users from API:', error);
        return of([]);
      })
    );
  }

  getUsersWithParams(params: {
    results?: number;
    gender?: 'male' | 'female';
    nat?: string;
    inc?: string;
  }): Observable<User[]> {
    const queryParams = new URLSearchParams();
    
    if (params.results) queryParams.set('results', params.results.toString());
    if (params.gender) queryParams.set('gender', params.gender);
    if (params.nat) queryParams.set('nat', params.nat);
    if (params.inc) queryParams.set('inc', params.inc);

    const url = `${this.API_URL}/?${queryParams.toString()}`;
    
    return this.http.get<RandomUserResponse>(url).pipe(
      map(response => {
        if (response && response.results) {
          return response.results;
        }
        throw new Error('Invalid response format');
      }),
      catchError(error => {
        console.error('Error fetching users with params from API:', error);
        return of([]);
      })
    );
  }
}
