import {
  Component,
  ElementRef,
  Injectable,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Form } from '../../shared/components/form/form';
import {
  FormComponent,
  IFormComponent,
} from '../../shared/components/form/form.component';

import { BehaviorSubject } from 'rxjs';
import { SaidasComponent } from './saidas.component';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DatepickerDirective } from '../../shared/directives/datepicker/datepicker.directive';
import { MaskDirective } from '../../shared/directives/mask/mask.directive';

declare const M: any;

@Component({
  selector: 'app-saidas-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    DialogComponent,
    DatepickerDirective,
    MaskDirective,
  ],
  templateUrl: './saidas.form.html',
  styleUrl: './saidas.component.scss',
})
export class SaidasForm extends Form implements IFormComponent {
  @ViewChild('formSaidas') formSaidas!: ElementRef;
  @ViewChild(DialogComponent) modalDialog!: DialogComponent;

  saidas$ = inject(SaidasComponent).saidas$;
  transactionsService = inject(TransactionsService);

  formTitle: string = '';
  isUpdate = signal(false);

  formGroup = this.formBuilder.group({
    id: ['', { disabled: true }],
    tipo: ['pagar', []],
    descricao: ['', {}],
    valor: ['', {}],
    data_vencimento: ['', {}],
    status: ['pendente', []],
  });

  edit(id: number) {
    const data = this.saidas$.value.find((item) => item.id === id);
    if (data) {
      Object.assign(data, { id: id });
      data.valor = data.valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      this.formGroup.patchValue(data);
      this.isUpdate.set(true);
      this.openForm();
      M.updateTextFields();
    }
  }

  removeSaida(id: number) {
    // 1. Chama o método open, passando a mensagem
    this.modalDialog
      .open(
        'Tem certeza que você deseja excluir este registro?',
        'Atenção: Ação Irreversível'
      )
      .subscribe((confirmed: boolean) => {
        // 2. Assina o Observable para receber o resultado
        if (confirmed) {
          const valuesBkp = [...this.saidas$.value];
          const filtrados = valuesBkp.filter((item) => item.id !== id);

          this.saidas$.next(filtrados);

          this.transactionsService.remove(id).subscribe({
            next: (response: any) => {
              M.toast({ html: response.message });
              this.transactionsService.notifyRefresh();
            },
            error: (error: any) => {
              this.saidas$.next(valuesBkp);
              M.toast({ html: error.message });
            },
          });
        } else {
          console.log('❌ Usuário CANCELOU! Nenhuma ação realizada.');
        }
      });
  }

  openForm(): void {
    const modalSaidas = this.formSaidas.nativeElement;
    const config = {
      onOpenStart: () => {
        let acao = this.isUpdate() ? 'Editar' : 'Cadastrar';
        this.formTitle = `${acao} Saída`;
      },
      onCloseStart: () => this.resetForm(),
    };
    const modal = M.Modal.init(modalSaidas, config);
    modal.open();
  }

  resetForm(): void {
    this.isUpdate.set(false);
    this.formGroup.get('tipo')?.setValue('pagar');
    this.formGroup.get('descricao')?.setValue(null);
    this.formGroup.get('data_vencimento')?.setValue(null);
    this.formGroup.get('valor')?.setValue(null);
    M.updateTextFields();
    const modal = M.Modal.getInstance(this.formSaidas.nativeElement);
    modal.close();
  }

  submitForm(data?: any): void {
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
        const updateList = this.saidas$.value;
        const newList = this.isUpdate()
          ? updateList.map((item) => (item.id === data.id ? data : item))
          : [...updateList, data];

        M.toast({ html: message });

        this.saidas$.next(newList);
        this.resetForm();
        this.transactionsService.notifyRefresh();
      },
      error: (error: any) => {},
    });
  }
}
