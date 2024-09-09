import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = "http://localhost:1200/api";

  constructor(private http: HttpClient) { }

  // Request OTP
  requestOTP(email: string): Observable<any> {
    const urlStr = `${this.apiUrl}/auth/request-otp`;
    return this.http.post(urlStr, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Verify OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/verify-otp`, { email, otp }).pipe(
      catchError(this.handleError)
    );
  }

  // Create Employee
  createEmployee(employeeData: any): Observable<any> {
    const urlStr = `${this.apiUrl}/employees`;
    return this.http.post(urlStr, employeeData).pipe(
      catchError(this.handleError)
    );
  }

  getEmployees(order: number,limit:number, page: number, payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in local storage');
    }
    const tokenStr = token.startsWith('Bearer ') ? token.substring(7) : token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokenStr}`,
      'Content-Type': 'application/json'
    });
  
    let params = new HttpParams()
      .set('order', order.toString())
      .set('page', page.toString())
      // .set('limit', payload.limit.toString());
  
    // if (payload.searchKey) {
    //   params = params.set('searchKey', payload.searchKey);
    // }
    Object.keys(payload).forEach(key => {
      if (payload[key]) { 
        params = params.set(key, payload[key]);
      }
    });

  
    const urlStr = `${this.apiUrl}/employees`;
    return this.http.get(urlStr, { headers, params });
  }
  
  updateEmployeeStatus(employeeId: string, action: 'activate' | 'deactivate'): Observable<any> {
    const url = `${this.apiUrl}/${action}/${employeeId}`;
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in local storage');
    }
    const tokenStr = token.startsWith('Bearer ') ? token.substring(7) : token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokenStr}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(url, {}, { headers });
  }




  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

}






