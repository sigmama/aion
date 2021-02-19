import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.siteUrl}:4000/api`;
  }

  addUser(u): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users`, u);
  }

  updateUser(u): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users`, u);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  deleteUser(userEid: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userEid}`);
  }

  getUserRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user-roles`);
  }
}
