import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private API_TOKEN = '';
  //   private baseUrl = 'https://accounter.com.br/api/v3';
  private baseUrl = 'http://localhost/cliniccloud-v3/api-v3/public/api/v3';
  //   private baseUrl = 'http://localhost/controle-financeiro-v3/api-v3/public/api/v3';
  private userId = localStorage.getItem('id');

  constructor(private http: HttpClient, protected route: Router) {}

  private getHeaders(extraHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('x-webhook-token', this.API_TOKEN);

    const token = localStorage.getItem('token');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (extraHeaders) {
      extraHeaders.keys().forEach((key) => {
        headers = headers.set(key, extraHeaders.get(key)!);
      });
    }

    return headers;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    params = this.userId ? { ...params, user_id: this.userId } : { ...params };
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params: params,
      })
      .pipe(
        tap(() => {
          //   this.preloaderService.show();
        }),
        finalize(() => {
          //   this.preloaderService.hide();
        })
      );
  }

  post<T>(endpoint: string, body: any | null): Observable<T> {
    // this.preloaderService.show();
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };

    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          //   let skeleton = document.querySelectorAll('.skeleton');
          //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          //   this.preloaderService.hide();
        })
      );
  }

  put<T>(endpoint: string, body: any | null): Observable<T> {
    // this.preloaderService.show();
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };

    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          //   let skeleton = document.querySelectorAll('.skeleton');
          //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          //   this.preloaderService.hide();
        })
      );
  }

  patch<T>(endpoint: string, body: any | null): Observable<T> {
    // this.preloaderService.show();
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };

    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          //   let skeleton = document.querySelectorAll('.skeleton');
          //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          //   this.preloaderService.hide();
        })
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    // this.preloaderService.show('progress-bar');

    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          //   let skeleton = document.querySelectorAll('.skeleton');
          //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          //   this.preloaderService.hide('progress-bar');
        })
      );
  }
}
