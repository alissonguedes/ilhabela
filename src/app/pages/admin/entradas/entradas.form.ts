import {
  Component,
  ElementRef,
  Injectable,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Form } from '../../../shared/components/form/form';
import {
  FormComponent,
  IFormComponent,
} from '../../../shared/components/form/form.component';

import { catchError, delay, of, switchMap } from 'rxjs';
import { TransactionsService } from '../../../services/transactions/transactions.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DatepickerDirective } from '../../../shared/directives/datepicker/datepicker.directive';
import { MaskDirective } from '../../../shared/directives/mask/mask.directive';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-entradas-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    DialogComponent,
    DatepickerDirective,
    MaskDirective,
  ],
  templateUrl: './entradas.form.html',
  styleUrl: './entradas.component.scss',
})
export class EntradasForm extends Form implements IFormComponent {
  @ViewChild('formEntradas') formEntradas!: ElementRef;
  @ViewChild(DialogComponent) modalDialog!: DialogComponent;

  private transactionsService = inject(TransactionsService);
  private entradasList = this.transactionsService.entradasList;

  public readonly isUpdate = signal(false);
  public readonly isSubmitting = signal(false);

  public formTitle: string = '';

  formGroup = this.formBuilder.group({
    id: null,
    tipo: ['receber'],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    data_vencimento: ['', [Validators.required]],
    comprovante: [''],
    status: ['pendente', []],
  });

  edit(id: number) {
    const data = this.entradasList().find((item) => item.id === id);
    if (data) {
      this.formGroup.patchValue({
        ...data,
        valor: (data.valor ?? 0).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
      this.isUpdate.set(true);
      this.openForm();
      M.updateTextFields();
    }
  }

  removeEntrada(id: number) {
    this.modalDialog
      .open(
        'Tem certeza que você deseja excluir este registro?',
        'Atenção: Ação Irreversível'
      )
      .pipe(
        switchMap((confirmed: boolean) => {
          if (!confirmed) {
            return of(null);
          }

          if (typeof M !== 'undefined' && M.toast) M.Toast.dismissAll();

          return this.transactionsService.remove(id);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error ao tentar excluir:', error);
          if (typeof M !== 'undefined' && M.toast)
            M.toast({
              html:
                'Erro ao tentar remover: ' +
                (error.message || 'Erro desconhecido.'),
            });
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response && response.message) {
          if (typeof M !== 'undefined' && M.toast)
            M.toast({ html: 'Registro removido com sucesso!' });
        }
      });
  }

  openForm(): void {
    const modalEntradas = this.formEntradas.nativeElement;
    const config = {
      onOpenStart: () => {
        let acao = this.isUpdate() ? 'Editar' : 'Cadastrar';
        this.formTitle = `${acao} Entrada`;
      },
      onCloseStart: () => this.resetForm(),
    };
    const modal = M.Modal.init(modalEntradas, config);
    modal.open();
  }

  resetForm(): void {
    this.isUpdate.set(false);
    this.isSubmitting.set(false);
    this.formGroup.reset({
      tipo: 'receber',
      descricao: null,
      data_vencimento: null,
      valor: null,
      status: 'pendente',
    });

    // Limpa todos os campos que possuem Datas
    const datepickers = this.formEntradas.nativeElement.querySelectorAll(
      '[datepicker]'
    ) as NodeListOf<HTMLInputElement>;
    datepickers.forEach((dp) => {
      dp.value = '';
      const instance = M.Datepicker.getInstance(dp);
      if (instance) instance.setDate(null);
    });

    M.updateTextFields();
    const modal = M.Modal.getInstance(this.formEntradas.nativeElement);
    modal.close();
  }

  submitForm(data?: any): void {
    if (this.formGroup.invalid) return;

    this.isSubmitting.set(true);

    const values = { ...data, id: this.formGroup.get('id')?.value };
    const id = values.id;
    delete values.id;

    const request$ = this.isUpdate()
      ? this.transactionsService.update(id, values)
      : this.transactionsService.insert(values);

    request$.subscribe({
      next: (response: any) => {
        const message =
          response.message ??
          (this.isUpdate()
            ? 'Registro atualizado com sucesso!'
            : 'Registro criado com sucesso!');

        M.toast({ html: message });

        this.resetForm();
      },
      error: (error: any) => {
        this.isSubmitting.set(false);
        M.toast({ html: error.message });
        document.querySelector('body')?.classList.remove('loading');
      },
    });
  }
}
