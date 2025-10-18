import { Component, Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export abstract class Form {
  protected formBuilder = inject(FormBuilder);
  protected abstract formGroup: FormGroup;
}
