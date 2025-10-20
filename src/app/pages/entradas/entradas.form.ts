import {
  Component,
  ElementRef,
  Injectable,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatCurrency } from '@angular/common';

import { Form } from '../../shared/components/form/form';
import {
  FormComponent,
  IFormComponent,
} from '../../shared/components/form/form.component';

import { BehaviorSubject } from 'rxjs';
import { EntradasComponent } from './entradas.component';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DatepickerDirective } from '../../shared/directives/datepicker/datepicker.directive';
// import { MaskDirective } from '../../shared/directives/mask/mask.directive';
import { MaskDirective } from '../../shared/directives/mask/mask.directive';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

declare const M: any;

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

  entradas$ = inject(EntradasComponent).entradas$;
  transactionsService = inject(TransactionsService);

  formTitle: string = '';
  isUpdate = signal(false);
  submited = signal(false);

  formGroup = this.formBuilder.group({
    id: ['', { disabled: true }],
    tipo: ['receber'],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    data_vencimento: ['', [Validators.required]],
    status: ['pendente', []],
  });

  edit(id: number) {
    const data = this.entradas$.value.find((item) => item.id === id);
    if (data) {
      this.formGroup.patchValue({
        ...data,
        valor: (data.valor ?? 0).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
      //   this.formGroup.patchValue(data);
      this.isUpdate.set(true);
      this.openForm();
      M.updateTextFields();
    }
  }

  removeEntrada(id: number) {
    // 1. Chama o método open, passando a mensagem
    this.modalDialog
      .open(
        'Tem certeza que você deseja excluir este registro?',
        'Atenção: Ação Irreversível'
      )
      .subscribe((confirmed: boolean) => {
        // 2. Assina o Observable para receber o resultado
        if (confirmed) {
          const valuesBkp = [...this.entradas$.value];
          const filtrados = valuesBkp.filter((item) => item.id !== id);

          this.transactionsService.remove(id).subscribe({
            next: (response: any) => {
              M.toast({ html: response.message });
              this.transactionsService.notifyRefresh();
              this.entradas$.next(filtrados);
            },
            error: (error: any) => {
              this.entradas$.next(valuesBkp);
              M.toast({ html: error.message });
            },
          });
        } else {
          console.log('❌ Usuário CANCELOU! Nenhuma ação realizada.');
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
    this.submited.set(false);
    this.formGroup.get('tipo')?.setValue('receber');
    this.formGroup.get('descricao')?.setValue(null);
    this.formGroup.get('data_vencimento')?.setValue(null);
    this.formGroup.get('valor')?.setValue(null);
    M.updateTextFields();
    const modal = M.Modal.getInstance(this.formEntradas.nativeElement);
    modal.close();
  }

  submitForm(data?: any): void {
    this.submited.set(true);
    const values = { ...data };
    const id = values.id || null;
    delete values.id;
    const request$ = this.isUpdate()
      ? this.transactionsService.update(id, values)
      : this.transactionsService.insert(values);

    request$.subscribe({
      next: (response: any) => {
        const data = response.data ?? response;
        const message =
          response.message ??
          (this.isUpdate()
            ? 'Registro atualizado com sucesso!'
            : 'Registro criado com sucesso!');
        const updateList = this.entradas$.value;
        const newList = this.isUpdate()
          ? updateList.map((item) => (item.id === data.id ? data : item))
          : [...updateList, data];

        M.toast({ html: message });

        this.entradas$.next(newList);
        this.resetForm();
        this.transactionsService.notifyRefresh();
      },
      error: (error: any) => {},
    });
  }
}
