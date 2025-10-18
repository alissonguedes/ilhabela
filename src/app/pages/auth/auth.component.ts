import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  IFormComponent,
  FormComponent,
  Validators,
  ReactiveFormsModule,
} from '../../shared/components/form/form.component';
import { Form } from '../../shared/components/form/form';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, FormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent extends Form implements OnInit, IFormComponent {
  private route: Router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild(FormComponent) formulario!: FormComponent;

  formGroup = this.formBuilder.group({
    username: [
      'usuarioteste@email.com',
      [Validators.required, Validators.email],
    ],
    password: ['teste123', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    document.body.classList.add('loading');
    let token = localStorage.getItem('token');
    if (token) {
      this.route.navigate(['/dashboard']);
    }
  }

  openForm(): void {}

  submitForm(): void {
    if (this.formGroup.valid) {
      let { username, password } = this.formGroup.value;
      this.authService.login(username!, password!);
    }
  }

  resetForm(): void {}

  logout() {
    this.authService.logout();
  }
}
