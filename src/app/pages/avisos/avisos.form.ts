import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { Form } from '../../shared/components/form/form';
import {
  IFormComponent,
  FormComponent,
  ReactiveFormsModule,
} from '../../shared/components/form/form.component';
import { NotesService } from '../../services/notes/notes.service';
import { AvisosComponent } from './avisos.component';

declare const M: any;

@Component({
  selector: 'app-avisos-form',
  imports: [CommonModule, FormComponent, ReactiveFormsModule],
  templateUrl: './avisos.form.html',
  styleUrl: './avisos.component.scss',
})
export class AvisosForm extends Form implements IFormComponent {
  @ViewChild('modalAvisos') modalAvisos!: ElementRef;

  dataSource$ = inject(AvisosComponent).avisos$;
  notesService = inject(NotesService);

  formTitle: string = '';
  isUpdate = signal(false);

  formGroup = this.formBuilder.group({
    id: ['', { disabled: true }],
    assunto: ['', {}],
    texto: ['', {}],
    status: ['', {}],
  });

  edit(id: number) {
    const data = this.dataSource$.value.find((item) => item.id === id);
    if (data) {
      this.isUpdate.set(true);
      data.status = data.status === 'published';
      this.formGroup.patchValue(data);
      this.openForm();
      M.updateTextFields();
    }
  }

  openForm(): void {
    const modalAvisos = this.modalAvisos.nativeElement;
    const config = {
      onOpenStart: () => {
        let acao = this.isUpdate() ? 'Editar' : 'Criar';
        this.formTitle = `${acao} Aviso`;
      },
      onCloseEnd: () => this.resetForm(),
    };
    const modal = M.Modal.init(modalAvisos, config);
    modal.open();
  }

  resetForm(): void {
    this.isUpdate.set(false);
    this.formGroup.get('assunto')?.setValue(null);
    this.formGroup.get('texto')?.setValue(null);
    this.formGroup.get('status')?.setValue(null);
    M.updateTextFields();
    const modal = M.Modal.getInstance(this.modalAvisos.nativeElement);
    modal.close();
  }

  submitForm(data?: any): void {
    const values = { ...data };
    const id = values.id || null;
    values.status = values.status ? 'published' : 'draft';
    delete values.id;

    const request$ = this.isUpdate()
      ? this.notesService.update(id, values)
      : this.notesService.insert(values);

    request$.subscribe({
      next: (response: any) => {
        const data = response.data ?? response;
        const message =
          response.message ??
          (this.isUpdate()
            ? 'Aviso atualizado com sucesso!'
            : 'Aviso criado com sucesso!');
        const updateList = this.dataSource$.value;
        const newList = this.isUpdate()
          ? updateList.map((item) => (item.id === data.id ? data : item))
          : [...updateList, data];

        M.toast({ html: message });

        this.dataSource$.next(newList);
        this.resetForm();
        this.notesService.notifyRefresh();
      },
      error: (error: any) => {},
    });
  }
}
