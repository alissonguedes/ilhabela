import { Injectable, signal } from '@angular/core';
import { HttpService } from '../http.service';

declare const M: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  private user = {
    authenticated: false,
    group: '', // admin | condomino
  };

  isSubmitting = signal(false);

  login(username: string, password: string) {
    this.isSubmitting.set(true);
    const data = { email: username, password: password };

    this.post(`login`, data).subscribe({
      next: (res: any) => {
        const user = res.user;

        // salva informações básicas
        localStorage.setItem('id', user.id);
        localStorage.setItem('username', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('token', res.access_token);

        // adiciona grupo (exemplo: 'admin' ou 'condomino')
        // backend deve enviar ou você pode definir regra local
        const group = user.group || (user.is_admin ? 'admin' : 'condomino');
        localStorage.setItem('group', group);

        console.log('Is admin: ', user.is_admin, typeof user.is_admin);

        this.user = {
          authenticated: true,
          group,
        };

        // // redireciona conforme o grupo
        const redirectTo = group === 'admin' ? '/dashboard' : '/portal';

        this.route.navigate([redirectTo], { replaceUrl: true }).then(() => {
          this.isSubmitting.set(false);
        });
      },
      error: (error: any) => {
        console.error('There was an error!', error);
        M.toast({ html: 'Usuário ou senha inválidos!' });
        localStorage.clear();
        this.isSubmitting.set(false);
      },
    });
  }

  logout() {
    const body = document.querySelector('body');
    this.post('logout', null).subscribe({
      next: () => {
        localStorage.clear();
        this.route.navigate(['/login']);
        body?.classList.remove('loading');
        this.user = { authenticated: false, group: '' };
      },
      error: () => {
        M.toast({ html: 'Erro ao tentar executar o recurso.' });
      },
    });
  }

  // 🔹 Recupera o usuário do localStorage
  getUser() {
    const data = {
      id: localStorage.getItem('id'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      group: localStorage.getItem('group') || '',
      authenticated: !!localStorage.getItem('token'),
    };
    return data;
  }

  // 🔹 Verifica se há sessão válida
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // 🔹 Retorna o grupo do usuário (admin | condomino)
  getUserGroup(): string {
    return localStorage.getItem('group') || '';
  }
}
