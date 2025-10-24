import {
  Component,
  ElementRef,
  Injectable,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
declare const document: any;

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
  isSubmitting = signal(false);

  // Variável para armazenar o arquivo selecionado (o objeto File)
  selectedFile: File | null = null;

  // O comprovante deve ser opcional ao carregar a data, mas a validação de obrigatoriedade
  // para o upload na criação deve ser tratada manualmente, como você fez.
  formGroup = this.formBuilder.group({
    id: ['', { disabled: true }],
    tipo: ['pagar'],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    data_vencimento: ['', [Validators.required]],
    comprovante: ['', []],
    status: ['pendente', []],
  });

  edit(id: number) {
    const data = this.saidas$.value.find((item) => item.id === id);
    if (data) {
      this.formGroup.patchValue({
        ...data,
        valor: data.valor.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
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
    this.isSubmitting.set(false);

    // Reseta o form reactive
    this.formGroup.reset();

    // Campos individuais
    this.selectedFile = null; // limpa arquivo selecionado
    this.formGroup.get('tipo')?.setValue('pagar');
    this.formGroup.get('descricao')?.setValue(null);
    this.formGroup.get('data_vencimento')?.setValue(null);
    this.formGroup.get('comprovante')?.setValue(''); // limpa exibição do file-field
    this.formGroup.get('valor')?.setValue(null);
    this.formGroup.get('status')?.setValue('pendente');

    // Limpa file-field
    const filePaths = this.formSaidas.nativeElement.querySelectorAll(
      '.file-path'
    ) as NodeListOf<HTMLInputElement>;
    filePaths.forEach((fp) => (fp.value = ''));

    // Limpa todos os datepickers do form
    const datepickers = this.formSaidas.nativeElement.querySelectorAll(
      '[datepicker]'
    ) as NodeListOf<HTMLInputElement>;
    datepickers.forEach((dp) => {
      dp.value = ''; // limpa o input
      const instance = M.Datepicker.getInstance(dp);
      if (instance) instance.setDate(null); // limpa a seleção interna
    });

    // Atualiza labels do Materialize
    M.updateTextFields();

    // Fecha modal
    const modal = M.Modal.getInstance(this.formSaidas.nativeElement);
    if (modal) modal.close();
  }

  acceptedTypes: string = 'image/*,application/pdf,text/plain';

  /**
   * Função auxiliar de verificação do tipo de arquivos válidos
   */
  isFileTypeValid(file: File, allowedTypes: string[]): boolean {
    // Se o tipo estiver vazio, tentar validar pelo nome da extensão
    if (!file.type) {
      const fileName = file.name || '';
      const ext = fileName.includes('.')
        ? fileName.split('.').pop()?.toLowerCase() || ''
        : '';
      return allowedTypes.some((type) => {
        // Se for tipo específico como 'text/plain', comparar com extensões
        if (type === 'text/plain' && ext === 'txt') return true;
        if (type === 'application/pdf' && ext === 'pdf') return true;
        if (
          type.startsWith('image/') &&
          ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
        )
          return true;
        return false;
      });
    }

    // Tipo definido, valida normalmente
    return allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.split('/')[0] + '/');
      }
      return file.type === type;
    });
  }

  /**
   * Método para lidar com a seleção do arquivo
   */
  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      this.selectedFile = this.uploadFiles(fileList);
    } else {
      this.selectedFile = null;
      this.formGroup.get('comprovante')?.setValue('');
    }
  }

  private uploadFiles(files: FileList) {
    const file: any = [];
    Array.from(files).forEach((f) => {
      if (!this.isFileTypeValid(f, this.acceptedTypes.split(','))) {
        this.formGroup.get('comprovante')?.setErrors({ invalid: true });
        this.formGroup.get('comprovante')?.markAsTouched();
        this.formGroup.get('comprovante')?.markAsPristine();
        return;
      }
      file.push(f);
    });

    return file;
  }

  submitForm(): void {
    // Validação customizada de arquivo na inserção
    // É obrigatório inserir o comprovante se o envio for POST
    if (!this.isUpdate() && !this.selectedFile) {
      this.formGroup.get('comprovante')?.setErrors({ required: true });
    }

    // Se o formulário tiver outros erros além da validação customizada, retorna.
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValues: any = this.formGroup.getRawValue();
    const id = formValues.id;

    this.isSubmitting.set(true);
    const payload = {
      ...formValues,
      comprovante: this.selectedFile,
    };

    // Remove o ID do objeto final, pois ele não deve ser enviado no corpo da requisição POST/PUT
    delete payload.id;

    const request$ = this.isUpdate()
      ? this.transactionsService.update(id, payload)
      : this.transactionsService.insert(payload);

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
      error: (error: any) => {
        this.isSubmitting.set(false);
        M.toast({ html: error.message });
      },
    });
  }
}
