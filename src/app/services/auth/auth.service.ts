import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

declare const M: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  login(username: string, password: string) {
    let data = { email: username, password: password };

    this.post(`login`, data).subscribe({
      next: (res: any) => {
        let user = res.user;
        localStorage.setItem('id', user.id);
        localStorage.setItem('username', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('token', res.access_token);
        this.route.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('There was an error!', error);
        M.toast({ html: 'Auth ou senha inválidos!' });
        localStorage.clear();
      },
    });
  }

  logout() {
    this.post('logout', null).subscribe({
      next: (res) => {
        localStorage.clear();
        this.route.navigate(['/login']);
      },
      error: (err) => {
        M.toast({ html: 'Erro ao tentar executar o recurso.' });
      },
    });
  }
}
