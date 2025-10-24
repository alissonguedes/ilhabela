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
    private baseUrl = 'https://ilhabela.fstrongart.com.br/api/v3';
//   private baseUrl = 'http://localhost/ilhabela-v3/api-v3/public/api/v3';
  // private baseUrl = 'http://localhost/controle-financeiro-v3/api-v3/public/api/v3';

  private get userId() {
    return localStorage.getItem('id');
  }

  constructor(private http: HttpClient, protected route: Router) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    params = this.userId ? { ...params, user_id: this.userId } : { ...params };
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        tap(() => {
          // this.preloaderService.show();
        }),
        finalize(() => {
          // this.preloaderService.hide();
        })
      );
  }

  //   /**
  //    * Converte objetos com arquivos em FormData
  //    */
  //   private toFormData(
  //     data: any,
  //     form: FormData = new FormData(),
  //     parentKey?: string
  //   ): FormData {
  //     if (
  //       data === null ||
  //       data === undefined ||
  //       data === '' ||
  //       data === 'null' ||
  //       data === 'undefined'
  //     ) {
  //       // Ignora valores nulos/vazios
  //       return form;
  //     }

  //     if (data instanceof Date) {
  //       // Converte Date para string ISO 8601 antes de anexar ao FormData
  //       form.append(parentKey!, data.toISOString());
  //     } else if (data instanceof File || data instanceof Blob) {
  //       // File ou Blob: anexa diretamente (usa a sobrecarga Blob)
  //       form.append(parentKey!, data);
  //     } else if (Array.isArray(data)) {
  //       // Array: trata cada elemento como um item do array
  //       data.forEach((value, index) => {
  //         this.toFormData(
  //           value,
  //           form,
  //           parentKey ? `${parentKey}[${index}]` : `[${index}]`
  //         );
  //       });
  //     } else if (
  //       typeof data === 'object' &&
  //       data.toString() === '[object Object]'
  //     ) {
  //       // Objeto: recursão em suas propriedades
  //       Object.keys(data).forEach((key) => {
  //         this.toFormData(
  //           data[key],
  //           form,
  //           parentKey ? `${parentKey}[${key}]` : key
  //         );
  //       });
  //     } else {
  //       // Valores primitivos (string, number, boolean): anexa
  //       // TypeScript aceita 'number' e 'boolean' pois são convertidos para string
  //       form.append(parentKey!, data.toString());
  //     }

  //     return form;
  //   }

  private toFormData(
    data: any,
    form: FormData = new FormData(),
    parentKey?: string
  ): FormData {
    if (
      data === null ||
      data === undefined ||
      data === '' ||
      data === 'null' ||
      data === 'undefined'
    ) {
      // Ignora valores nulos/vazios
      return form;
    }

    if (data instanceof Date) {
      // Converte Date para string ISO 8601 antes de anexar ao FormData
      form.append(parentKey!, data.toISOString());
    } else if (data instanceof File || data instanceof Blob) {
      // File ou Blob: anexa diretamente (usa a sobrecarga Blob)
      form.append(parentKey!, data);
    } else if (Array.isArray(data)) {
      // Array: usa a notação 'key[]' para PHP (mais robusta para uploads)
      data.forEach((value) => {
        // Se parentKey existir, anexa '[]'
        const key = parentKey ? `${parentKey}[]` : '[]';

        // Se o valor for um objeto complexo (não File/Blob/Date), usamos a recursão
        if (
          typeof value === 'object' &&
          value !== null &&
          !(value instanceof File) &&
          !(value instanceof Blob) &&
          !(value instanceof Date)
        ) {
          // Recursão para objetos dentro do array, mantendo a notação de índice implícito do FormData/PHP
          this.toFormData(
            value,
            form,
            parentKey ? parentKey : key // Usa a chave pai sem '[]' para que os sub-campos sejam anexados corretamente
          );
        } else {
          // Valores simples (incluindo File/Blob) usam a notação 'key[]'
          form.append(key, value);
        }
      });
      return form; // Retorna aqui após processar o array
    } else if (
      typeof data === 'object' &&
      data.toString() === '[object Object]'
    ) {
      // Objeto: recursão em suas propriedades
      Object.keys(data).forEach((key) => {
        this.toFormData(
          data[key],
          form,
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      // Valores primitivos (string, number, boolean): anexa
      form.append(parentKey!, data.toString());
    }

    return form;
  }

  /**
   * Verifica se um objeto (e seus sub-objetos) contém uma instância de File ou Blob.
   * O método anterior era muito complexo. Uma verificação mais simples é:
   * se o corpo é um FormData, ou se o corpo (e sub-elementos) contêm File/Blob.
   */
  private checkIsFileUpload(body: any): boolean {
    if (body instanceof FormData) return true;
    if (body instanceof File || body instanceof Blob) return true;

    // Verifica recursivamente se é um objeto
    if (typeof body === 'object' && body !== null) {
      return Object.values(body).some((value) => this.checkIsFileUpload(value));
    }
    return false;
  }

  /**
   * Lógica de preparação de headers
   */
  private getHeaders(
    extraHeaders?: HttpHeaders,
    isFileUpload = false
  ): HttpHeaders {
    let headers = new HttpHeaders().set('x-webhook-token', this.API_TOKEN);
    const token = localStorage.getItem('token');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // O browser definirá o Content-Type: multipart/form-data BOUNDARY automaticamente.
    if (!isFileUpload) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (extraHeaders) {
      extraHeaders.keys().forEach((key) => {
        // Excluir Content-Type se for upload ou se o usuário tentar definir
        if (isFileUpload && key.toLowerCase() === 'content-type') return;
        headers = headers.set(key, extraHeaders.get(key)!);
      });
    }

    return headers;
  }

  /**
   * Lógica de preparação do corpo do formulário
   */
  private prepareBody(body: any): { payload: any; isFileUpload: boolean } {
    const dataWithUserId = this.userId
      ? { ...body, user_id: this.userId }
      : body;

    // Verifica se é necessário FormData
    const isFileUpload = this.checkIsFileUpload(dataWithUserId);

    // Se for upload, converte o objeto (incluindo user_id) para FormData
    const payload = isFileUpload
      ? this.toFormData(dataWithUserId)
      : dataWithUserId;

    return { payload, isFileUpload };
  }

  post<T>(endpoint: string, body: any | null): Observable<T> {
    const { payload, isFileUpload } = this.prepareBody(body);
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, payload, {
        headers: this.getHeaders(undefined, isFileUpload),
        withCredentials: true,
      })
      .pipe(
        // Adiciona logging detalhado de erro para depuração
        tap({
          error: (error) => {
            console.error(
              `\n--- Erro da API (POST) na URL: ${this.baseUrl}/${endpoint} ---`
            );
            console.error('Status:', error.status);
            console.error(
              'Corpo do Erro (se disponível):',
              error.error || error.message
            );
            console.error('Objeto de Erro Completo:', error);
            console.error('--------------------------------------\n');
          },
        })
      );
  }

  /**
   * Método PUT com Method Spoofing para lidar com uploads de arquivos.
   */
  put<T>(endpoint: string, body: any | null): Observable<T> {
    const { payload, isFileUpload } = this.prepareBody(body);
    const url = `${this.baseUrl}/${endpoint}`;

    let request$!: Observable<T>;

    if (isFileUpload && payload instanceof FormData) {
      // 1. Adiciona o campo de Method Spoofing
      payload.append('_method', 'PUT');

      // 2. Chama POST (que é o que o navegador suporta para FormData)
      request$ = this.http.post<T>(url, payload, {
        headers: this.getHeaders(undefined, isFileUpload),
        withCredentials: true,
      });
    } else {
      // Caso contrário (JSON), usa o PUT nativo
      request$ = this.http.put<T>(url, payload, {
        headers: this.getHeaders(undefined, isFileUpload),
        withCredentials: true,
      });
    }

    return request$.pipe(
      // Adiciona logging detalhado de erro para depuração
      tap({
        error: (error) => {
          console.error(`\n--- Erro da API (PUT) na URL: ${url} ---`);
          console.error('Status:', error.status);
          console.error(
            'Corpo do Erro (se disponível):',
            error.error || error.message
          );
          console.error('Objeto de Erro Completo:', error);
          console.error('--------------------------------------\n');
        },
      })
    );
  }

  /**
   * Método PATCH com Method Spoofing para lidar com uploads de arquivos.
   */
  patch<T>(endpoint: string, body: any | null): Observable<T> {
    const { payload, isFileUpload } = this.prepareBody(body);
    const url = `${this.baseUrl}/${endpoint}`;

    let request$!: Observable<T>;

    if (isFileUpload && payload instanceof FormData) {
      // 1. Adiciona o campo de Method Spoofing
      payload.append('_method', 'PATCH');

      // 2. Chama POST (que é o que o navegador suporta para FormData)
      request$ = this.http.post<T>(url, payload, {
        headers: this.getHeaders(undefined, isFileUpload),
        withCredentials: true,
      });
    } else {
      // Caso contrário (JSON), usa o PATCH nativo
      request$ = this.http.patch<T>(url, payload, {
        headers: this.getHeaders(undefined, isFileUpload),
        withCredentials: true,
      });
    }

    return request$.pipe(
      // Adiciona logging detalhado de erro para depuração
      tap({
        error: (error) => {
          console.error(`\n--- Erro da API (PATCH) na URL: ${url} ---`);
          console.error('Status:', error.status);
          console.error(
            'Corpo do Erro (se disponível):',
            error.error || error.message
          );
          console.error('Objeto de Erro Completo:', error);
          console.error('--------------------------------------\n');
        },
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          // let skeleton = document.querySelectorAll('.skeleton');
          // skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          // this.preloaderService.hide('progress-bar');
        })
      );
  }
}
