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
  //   private baseUrl = 'https://ilhabela.fstrongart.com.br/api/v3';
  private baseUrl = 'http://localhost/ilhabela-v3/api-v3/public/api/v3';
  // private baseUrl = 'http://localhost/controle-financeiro-v3/api-v3/public/api/v3';
  private userId = localStorage.getItem('id');

  constructor(private http: HttpClient, protected route: Router) {}

  /** Detecta se o corpo contém arquivos */
  private hasFile(data: any): boolean {
    if (!data) return false;
    if (
      data instanceof File ||
      data instanceof Blob ||
      data instanceof FileList
    )
      return true;
    if (typeof data === 'object') {
      return Object.values(data).some((v) => this.hasFile(v));
    }
    return false;
  }

  /** Converte automaticamente objetos com arquivos em FormData */
  private toFormData(
    data: any,
    form: FormData = new FormData(),
    parentKey?: string
  ): FormData {
    if (
      data &&
      typeof data === 'object' &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach((key) => {
        this.toFormData(
          data[key],
          form,
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else if (data != null) {
      form.append(parentKey!, data);
    }
    return form;
  }

  private getHeaders(
    extraHeaders?: HttpHeaders,
    isFileUpload = false
  ): HttpHeaders {
    // let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let headers = new HttpHeaders().set('x-webhook-token', this.API_TOKEN);

    const token = localStorage.getItem('token');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Só define JSON se não for upload
    if (!isFileUpload)
      headers = headers.set('Content-Type', 'application/json');

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

  //   post<T>(endpoint: string, body: any | null): Observable<T> {
  //     // this.preloaderService.show();
  //     body = this.userId ? { ...body, user_id: this.userId } : { ...body };

  //     return this.http
  //       .post<T>(`${this.baseUrl}/${endpoint}`, body, {
  //         headers: this.getHeaders(),
  //         withCredentials: true,
  //       })
  //       .pipe(
  //         finalize(() => {
  //           //   let skeleton = document.querySelectorAll('.skeleton');
  //           //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
  //           //   this.preloaderService.hide();
  //         })
  //       );
  //   }

  post<T>(endpoint: string, body: any | null): Observable<T> {
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };
    const isUpload = this.hasFile(body);
    const payload = isUpload ? this.toFormData(body) : body;

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, payload, {
      headers: this.getHeaders(undefined, isUpload),
      withCredentials: true,
    });
  }

  put<T>(endpoint: string, body: any | null): Observable<T> {
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };
    const isUpload = this.hasFile(body);
    const payload = isUpload ? this.toFormData(body) : body;

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, payload, {
      headers: this.getHeaders(undefined, isUpload),
      withCredentials: true,
    });
  }

  patch<T>(endpoint: string, body: any | null): Observable<T> {
    body = this.userId ? { ...body, user_id: this.userId } : { ...body };
    const isUpload = this.hasFile(body);
    const payload = isUpload ? this.toFormData(body) : body;

    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, payload, {
      headers: this.getHeaders(undefined, isUpload),
      withCredentials: true,
    });
  }

  //   put<T>(endpoint: string, body: any | null): Observable<T> {
  //     // this.preloaderService.show();
  //     body = this.userId ? { ...body, user_id: this.userId } : { ...body };

  //     return this.http
  //       .put<T>(`${this.baseUrl}/${endpoint}`, body, {
  //         headers: this.getHeaders(),
  //         withCredentials: true,
  //       })
  //       .pipe(
  //         finalize(() => {
  //           //   let skeleton = document.querySelectorAll('.skeleton');
  //           //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
  //           //   this.preloaderService.hide();
  //         })
  //       );
  //   }

  //   patch<T>(endpoint: string, body: any | null): Observable<T> {
  //     // this.preloaderService.show();
  //     body = this.userId ? { ...body, user_id: this.userId } : { ...body };

  //     return this.http
  //       .patch<T>(`${this.baseUrl}/${endpoint}`, body, {
  //         headers: this.getHeaders(),
  //         withCredentials: true,
  //       })
  //       .pipe(
  //         finalize(() => {
  //           //   let skeleton = document.querySelectorAll('.skeleton');
  //           //   skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
  //           //   this.preloaderService.hide();
  //         })
  //       );
  //   }

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
