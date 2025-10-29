import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [CommonModule, ReactiveFormsModule, FormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent extends Form implements OnInit, IFormComponent {
  protected authService = inject(AuthService);
  private route: Router = inject(Router);

  @ViewChild(FormComponent) formulario!: FormComponent;

  formGroup = this.formBuilder.group({
    username: [null, [(Validators.required, Validators.email)]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    document.body.classList.add('loading');
    let token = localStorage.getItem('token');
    if (token) {
      this.route.navigate(['/dashboard']);
    }
    let body = document.querySelector('body');
    body?.classList.remove('loading');
  }

  openForm(): void {}

  submitForm(): void {
    if (this.formGroup.valid) {
      this.authService.isSubmitting.set(true);
      let { username, password } = this.formGroup.value;
      this.authService.login(username!, password!);
    }
  }

  resetForm(): void {}

  logout() {
    this.authService.logout();
  }
}
