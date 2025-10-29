import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements AfterViewInit {
  painel: string = '/';
  isDashboard: boolean = false;

  constructor(protected auth: AuthService, protected route: Router) {}

  ngAfterViewInit(): void {
    M.Tooltip.init(document.querySelectorAll('[data-tooltip]'));
  }

  irParaPainel() {
    // alterna entre portal e dashboard
    const current = this.route.url;
    const destino = current.startsWith('/dashboard') ? '/portal' : '/dashboard';

    this.route.navigateByUrl(destino);
  }
}
