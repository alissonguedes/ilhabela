import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';

import { Form } from '../../../shared/components/form/form';
import {
  FormComponent,
  IFormComponent,
} from '../../../shared/components/form/form.component';

import { TransactionsService } from '../../../services/transactions/transactions.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DatepickerDirective } from '../../../shared/directives/datepicker/datepicker.directive';
import { MaskDirective } from '../../../shared/directives/mask/mask.directive';

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
export class SaidasForm extends Form implements OnInit, IFormComponent {
  @ViewChild('formSaidas') formSaidas!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('filePathRef') filePathRef!: ElementRef<HTMLInputElement>;
  @ViewChild(DialogComponent) modalDialog!: DialogComponent;

  private transactionsService = inject(TransactionsService);
  private saidasList = this.transactionsService.saidasList;

  public readonly isUpdate = signal(false);
  public readonly isSubmitting = signal(false);

  public formTitle: string = '';

  private selectedFile: File[] | null = null;
  public acceptedTypes: string = 'image/*,application/pdf,text/plain';

  formGroup = this.formBuilder.group({
    id: ['', { disabled: true }],
    tipo: ['pagar'],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    data_vencimento: ['', [Validators.required]],
    comprovante: [null],
    status: ['pendente', []],
  });

  ngOnInit(): void {}

  /* -------------------------------------------------------------------------
   * #1 - Responsabilidade: Controle de edição
   * Esta lógica poderia ir para uma classe `SaidasEditor`, responsável
   * apenas por carregar dados no formulário e abrir o modal.
   * ------------------------------------------------------------------------- */
  edit(id: number) {
    const data = this.saidasList().find((item) => item.id === id);
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

  /* -------------------------------------------------------------------------
   * #2 - Responsabilidade: Remoção de registros
   * Esta rotina poderia pertencer a uma classe `SaidasRemoverService`
   * para lidar com confirmação, exclusão e rollback.
   * ------------------------------------------------------------------------- */
  removeSaida(id: number) {
    this.modalDialog
      .open(
        'Tem certeza que você deseja excluir este registro?',
        'Atenção: Ação Irreversível'
      )
      .pipe(
        switchMap((confirmed: boolean) => {
          if (!confirmed) {
            console.log('❌ Usuário CANCELOU! Nenhuma ação realizada.');
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

  /* -------------------------------------------------------------------------
   * #3 - Responsabilidade: Controle do modal e reset de formulário
   * Poderia ser extraído em uma classe `SaidasModalManager`
   * que cuida da abertura, fechamento e limpeza do form.
   * ------------------------------------------------------------------------- */
  openForm(): void {
    const modalSaidas = this.formSaidas.nativeElement;
    const config = {
      onOpenStart: () => {
        let acao = this.isUpdate() ? 'Editar' : 'Cadastrar';
        this.formTitle = `${acao} Saída`;
        const comprovante = this.formGroup.get('comprovante');
        if (this.isUpdate()) {
          comprovante?.clearValidators();
        } else {
          comprovante?.setValidators(Validators.required);
        }
        comprovante?.updateValueAndValidity();
      },
      onCloseStart: () => this.resetForm(),
    };
    const modal = M.Modal.init(modalSaidas, config);
    modal.open();
  }

  resetForm(): void {
    this.isUpdate.set(false);
    this.isSubmitting.set(false);
    this.formGroup.reset({
      tipo: 'pagar',
      descricao: null,
      data_vencimento: null,
      valor: null,
      status: 'pendente',
      comprovante: null,
    });

    this.selectedFile = [];

    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';

    const filePaths = this.formSaidas.nativeElement.querySelectorAll(
      '.file-path'
    ) as NodeListOf<HTMLInputElement>;
    filePaths.forEach((fp) => (fp.value = ''));

    const datepickers = this.formSaidas.nativeElement.querySelectorAll(
      '[datepicker]'
    ) as NodeListOf<HTMLInputElement>;
    datepickers.forEach((dp) => {
      dp.value = '';
      const instance = M.Datepicker.getInstance(dp);
      if (instance) instance.setDate(null);
    });

    M.updateTextFields();

    const modal = M.Modal.getInstance(this.formSaidas.nativeElement);
    if (modal) modal.close();
  }

  /* -------------------------------------------------------------------------
   * #4 - Responsabilidade: Validação e upload de arquivos
   * Poderia ser extraída em uma classe `FileHandler` ou `UploadValidatorService`
   * ------------------------------------------------------------------------- */
  isFileTypeValid(file: File, allowedTypes: string[]): boolean {
    if (!file.type) {
      const fileName = file.name || '';
      const ext = fileName.includes('.')
        ? fileName.split('.').pop()?.toLowerCase() || ''
        : '';
      return allowedTypes.some((type) => {
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

    return allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.split('/')[0] + '/');
      }
      return file.type === type;
    });
  }

  onFileSelected_1(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = input.files;
    const comprovanteControl = this.formGroup.get('comprovante');

    if (fileList && fileList.length > 0) {
      this.selectedFile = this.uploadFiles(fileList);

      if (this.selectedFile === null) {
        comprovanteControl?.setValue(null);
        comprovanteControl?.setErrors({ invalidFileType: true });
      } else {
        comprovanteControl?.updateValueAndValidity();
      }
    } else {
      this.selectedFile = null;
      comprovanteControl?.setValue(null);
      comprovanteControl?.setErrors(null);
      comprovanteControl?.updateValueAndValidity();
    }

    // 4. Marca como 'touched' (para exibir erro 'required' se for o caso)
    comprovanteControl?.markAsTouched();
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = input.files;
    const comprovanteControl = this.formGroup.get('comprovante');

    // definir o campo como vazio sempre que o usuário cancelar o input
    this.selectedFile = null;
    comprovanteControl?.setValue(null);

    const setErrors = (errors: ValidationErrors | null) => {
      comprovanteControl?.setErrors(errors);
      comprovanteControl?.markAsTouched();
      console.log(comprovanteControl?.value);
    };

    if (fileList && fileList.length > 0) {
      this.selectedFile = this.uploadFiles(fileList);
      if (this.selectedFile === null) {
        setErrors({ invalidFileType: true });
        return;
      }
    }

    if (!this.isUpdate() && this.selectedFile === null) {
      setErrors(Validators.required);
      comprovanteControl?.updateValueAndValidity();
      return;
    }

    // Se o campo tudo ocorrer bem, definir o campo como válido
    setErrors(null);
  }

  private uploadFiles(files: FileList | null) {
    const file: any = [];

    if (files === null) return null;

    for (const f of Array.from(files)) {
      if (!this.isFileTypeValid(f, this.acceptedTypes.split(','))) {
        return null;
      }
      file.push(f);
    }

    return file;
  }

  /* -------------------------------------------------------------------------
   * #5 - Responsabilidade: Submissão e integração com TransactionsService
   * Poderia estar em uma classe `SaidasFormSubmitter` ou `SaidasServiceCoordinator`
   * que cuidaria de montar payloads, validar e tratar respostas.
   * ------------------------------------------------------------------------- */
  submitForm(): void {
    if (this.formGroup.invalid) {
      // Chama a função para revalidar o input[type="file"] para evitar de enviar campo inválido ou vazio
      this.uploadFiles(null);
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const values: any = {
      ...this.formGroup.getRawValue(),
      id: this.formGroup.get('id')?.value,
    };
    const id = values.id;
    delete values.id;

    const payload = { ...values, comprovante: this.selectedFile };

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
