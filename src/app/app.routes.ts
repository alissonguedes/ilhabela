import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { HomeComponent as Portal } from './pages/portal/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'portal', component: Portal },
    ],
  },

  // Autenticação
  { path: 'login', component: AuthComponent },
  { path: 'logout', component: AuthComponent },
  { path: '**', redirectTo: 'login' },
];
