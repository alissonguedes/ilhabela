import { Injectable } from '@angular/core';
import { FormComponent } from './form.component';

@Injectable({ providedIn: 'root' })
export class FormService {
  private formComponent?: FormComponent;

  // Registra o FormComponent
  register(form: FormComponent) {
    this.formComponent = form;
  }

  // Abre o formulário sem precisar do componente filho fazer subscribe
  open() {
    if (!this.formComponent) {
      console.warn('FormComponent não registrado no FormService!');
      return;
    }
    this.formComponent.openForm();
  }

  // Fecha o formulário
  close() {
    if (!this.formComponent) return;
    this.formComponent.resetForm();
  }
}
