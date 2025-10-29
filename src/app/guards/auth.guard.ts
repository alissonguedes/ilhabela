import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    const group = this.auth.getUserGroup();

    if (group === 'admin') {
      // admin tem acesso total
      return true;
    }

    if (group === 'condomino') {
      // condomino só acessa portal
      if (state.url.startsWith('/portal')) return true;
      // caso tente acessar dashboard → força redirecionamento
      return this.router.createUrlTree(['/portal']);
    }

    return this.router.createUrlTree(['/login']);
  }
}
