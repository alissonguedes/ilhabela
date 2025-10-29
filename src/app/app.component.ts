import { Component, HostListener, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { tap, filter } from 'rxjs';
import { TransactionsService } from './services/transactions/transactions.service';
import { AuthService } from './services/auth/auth.service';

declare const document: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private currentUrl: string = '';
  title = 'ilhabela-v3';

  constructor(private router: Router, private auth: AuthService) {}

  @HostListener('document:click', ['$event'])
  hanldeGlobalClick(event: MouseEvent) {
    let body = document.querySelector('body');
    const target = event.target as HTMLElement;
    const anchor = target.closest('[routerLInk]') as HTMLElement | null;
  }

  ngOnInit(): void {
    let body = document.querySelector('body');
    this.router.events
      .pipe(
        tap((e) => {
          body.classList.add('loading');
          this.currentUrl = this.router.url;
        }),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          const group = this.auth.getUserGroup();
          if (group === 'condomino' && event.url.startsWith('/dashboard')) {
            this.router.navigate(['/portal']);
          }
        }
      });

    this.router.events
      .pipe(
        tap((e) => {
          body?.classList.remove('loading');
        }),
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((route: any) => {
        let url = route.url.split('/').filter((s: any) => s)[0];
        this.currentUrl = url;
      });
  }
}
