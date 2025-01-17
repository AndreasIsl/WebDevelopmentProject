import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  private baseUrl = 'http://localhost:5000'; // Backend URL

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/authen`);
  }

  addItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authen`, item);
  }
}
