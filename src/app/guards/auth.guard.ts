import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpService } from '../services/http.service';

declare const M: any;

async function isAuthenticated(): Promise<boolean> {
  const http = inject(HttpService);
  const router = inject(Router);

  try {
    const response = await http.get<any>('me').toPromise();
    return response.authorized;
  } catch (e) {
    M.toast({ html: 'Sessão expirada. Faça login novamente.' });
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }
}

export const AuthGuard: CanActivateFn = async (route, state) => {
  return await isAuthenticated();
};
