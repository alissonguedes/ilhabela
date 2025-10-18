import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  inject,
  ContentChild,
  AfterContentInit,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare const M: any;

/**
 * @interface IFormBehavior
 * Define o comportamento base que qualquer formulário deve ter.
 * Inclui métodos de controle de exibição, envio e reset.
 */
export interface IFormBehavior<T = any> {
  openForm(): void;
  submitForm(data?: T): void;
  resetForm(): void;
}

/**
 * @interface IFormPresentation
 * Define propriedades de apresentação do formulário,
 * como título e rótulos dos botões.
 */
export interface IFormPresentation {
  title?: string;
  labelSubmit?: string;
  labelReset?: string;
}

/**
 * @interface IFormComponent
 * Interface principal que combina o comportamento (FormBehavior)
 * e a apresentação (FormPresentation), além de exigir um FormGroup.
 */
export interface IFormComponent<T = any>
  extends IFormBehavior<T>,
    IFormPresentation {
  formGroup: FormGroup;
}

/**
 * @component FormComponent
 *
 * Componente base de formulário reutilizável.
 *
 * Responsável por controlar a exibição, validação e envio do formulário.
 * Recebe um `FormGroup` e uma função `onSubmit` do componente pai,
 * que define a lógica de tratamento dos dados.
 */
@Component({
  selector: 'x-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent
  implements AfterContentInit, IFormComponent<FormGroup>
{
  @ViewChild('formulario') formulario!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() title?: string = '';
  @Input() labelSubmit?: string = 'Salvar';
  @Input() labelReset?: string = 'Cancelar';

  // viewRef Acessa a instância do componente pai (host)
  private viewRef = inject(ViewContainerRef);
  private parentInstance: any;

  // Marcações para detectar se o conteúdo foi projetado
  // Verifica a existência do conteúdo projetado customizado
  // O seletor deve ser igual ao atributo usado no componente pai: [card-header]
  @ContentChild('cardHeader') customHeader?: ElementRef;
  @ContentChild('cardContent') customContent?: ElementRef;
  @ContentChild('cardAction') customAction?: ElementRef;

  hasHeader = false;
  hasAction = false;
  hasContent = false;

  ngAfterContentInit() {
    this.hasHeader = !!this.customHeader;
    this.hasContent = !!this.customContent;
    this.hasAction = !!this.customAction;
  }

  ngOnInit() {
    // hostView contém a referência ao componente pai
    const hostView: any = (this.viewRef as any)._hostLView;
    this.parentInstance = hostView?.[8]; // índice 8 armazena o "context" (pai)
  }

  openForm() {
    const form = this.formulario.nativeElement;
    if (!form.classList.contains('open')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      form.classList.add('open');
    }
  }

  submitForm() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    if (
      this.parentInstance &&
      typeof this.parentInstance.submitForm === 'function'
    ) {
      this.parentInstance.submitForm(this.formGroup.value);
    } else {
      console.warn('Nenhum método submitForm encontrado no componente pai.');
    }
  }

  resetForm() {
    const form = this.formulario.nativeElement;
    if (form.classList.contains('open')) {
      this.formGroup.reset();
      form.classList.remove('open');
      M.updateTextFields();
    }

    if (
      this.parentInstance &&
      typeof this.parentInstance.resetForm === 'function'
    ) {
      this.parentInstance.resetForm();
    }
  }
}

/** Exporta módulos utilitários para facilitar importação externa. */
export { ReactiveFormsModule, Validators };
