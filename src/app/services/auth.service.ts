import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/auth';

  constructor(private http: HttpClient) { }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.get(`${this.apiUrl}/login`, { params });
  }


  getProtectedData(): Observable<any> {
    // Hol das Token aus dem localStorage
    const token = localStorage.getItem('token');

    // Wenn kein Token vorhanden ist, gib einen Fehler zurück
    if (!token) {
      throw new Error('Kein Token gefunden');
    }

    // Setze den Authorization Header mit dem Token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Sende die GET-Anfrage mit den Headern an den geschützten Endpunkt
    return this.http.get(`${this.apiUrl}/protected`, { headers });
  }
  

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
