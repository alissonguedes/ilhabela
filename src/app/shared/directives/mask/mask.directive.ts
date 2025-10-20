import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { NgControl } from '@angular/forms'; // Importar NgControl

import { MaskService } from './mask.service'; // Assumindo que o serviço está no mesmo diretório

@Directive({
  selector: '[mask]', // Uso: <input type="text" mask="cpf">
})
export class MaskDirective implements OnInit {
  @Input('mask') maskType: string | boolean | undefined = 'string'; // O tipo de máscara a ser aplicada

  private inputElement: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private maskService: MaskService,
    @Optional() private ngControl: NgControl
  ) {
    this.inputElement = this.el.nativeElement;
  }

  ngOnInit(): void {
    const definedMaxLength =
      this.maskService.maxlength[
        this.maskType as keyof MaskService['maxlength']
      ];
    if (definedMaxLength) {
      this.inputElement.setAttribute('maxlength', definedMaxLength.toString());
    }

    // Aplica a máscara inicial se houver um valor
    this.applyMask(this.inputElement.value);
  }

  // Onde a lógica de máscara é aplicada, precisamos atualizar o MODEL também.
  private updateModelValue(maskedValue: string, isDecimal: boolean): void {
    if (this.ngControl && this.ngControl.control) {
      let cleanValue!: string;

      if (isDecimal) {
        // Para Decimal: use a função que limpa o valor (ex: "1.234,56" -> "1234.56")
        // cleanValue = this.maskService.masker.normalizeValue(maskedValue);
        cleanValue = maskedValue;
      } else {
        // Para CPF/CNPJ/etc.: remova todos os caracteres não numéricos.
        cleanValue = this.maskService.masker.numeric(maskedValue);
      }

      // 1. Atualiza o valor do input (View Value)
      this.inputElement.value = maskedValue;

      // 2. Atualiza o valor do form control (Model Value) com o valor limpo
      // { emitEvent: false } previne um loop infinito de eventos.
      this.ngControl.control.setValue(cleanValue, { emitEvent: false });
    } else {
      // Se não houver NgControl, apenas atualiza a View Value (funciona para inputs simples)
      this.inputElement.value = maskedValue;
    }
  }

  // Lógica para máscaras padrão (cpf, data, etc.)
  private applyMask(value: string): void {
    // 1. CHECAGEM DE TIPO E SEGURANÇA:
    // Garante que this.maskType é uma string válida para ser usada como chave.
    if (typeof this.maskType !== 'string') {
      return;
    }

    // 2. BUSCA DA FUNÇÃO: O TypeScript sabe que this.maskType é uma string.
    // Usamos 'keyof any' para evitar o erro de 'string | boolean'
    const key = this.maskType as keyof typeof this.maskService.masker;
    const maskerFn = this.maskService.masker[key];

    // 3. SEGUNDA CHECAGEM: Verifica se o valor encontrado é de fato uma FUNÇÃO e não 'decimal'
    if (typeof maskerFn === 'function' && this.maskType !== 'decimal') {
      // O TypeScript sabe com certeza que 'maskerFn' é uma função
      const maskedValue = maskerFn(value);

      // A atribuição está segura, pois 'maskedValue' é garantidamente o retorno de uma função do tipo (v: string) => string.
      this.inputElement.value = maskedValue;
    }
  }

  // --- Lógica para Máscaras Padrão (Eventos) ---
  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (this.maskType !== 'decimal') {
      this.applyMask(value);
    } else {
      const maskedValue = this.maskService.masker.decimal(
        this.inputElement.value
      );
      // ATUALIZAÇÃO CHAVE: Chamar a função de atualização para o decimal
      this.updateModelValue(maskedValue, true);
    }
    this.validateFormat();
  }

  // O HostListener 'keydown' é usado para o caso especial do decimal (backspace no '0,00')
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.maskType === 'decimal') {
      const value = this.inputElement.value;
      if (value === '0,00' && event.key === 'Backspace') {
        this.inputElement.value = '0,00';
        this.inputElement.dataset['value'] = '0.00';
        event.preventDefault(); // Impede o comportamento padrão
      }
    }
  }

  @HostListener('focus')
  onFocus(): void {
    if (this.maskType === 'decimal') {
      // Configurações iniciais (placeholder e alinhamento do JS original)
      this.inputElement.setAttribute('placeholder', '0,00');

      // Simula a lógica de inicialização de valor '0,00' no focus
      if (
        !this.inputElement.value ||
        parseFloat(
          this.maskService.masker.normalizeValue(this.inputElement.value)
        ) === 0
      ) {
        this.inputElement.value = '0,00';
        this.inputElement.dataset['value'] = '0.00';
      }
      // Você pode adicionar a lógica de alinhamento CSS aqui ou via classe CSS
      // Ex: this.inputElement.classList.add('text-right');
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.maskType === 'decimal') {
      // Simula a lógica de manutenção do valor '0,00' no blur
      if (
        !this.inputElement.value ||
        parseFloat(
          this.maskService.masker.normalizeValue(this.inputElement.value)
        ) === 0
      ) {
        this.inputElement.value = '0,00';
        this.inputElement.dataset['value'] = '0.00';
      }
    }
  }

  // --- Lógica de Validação (Migração da Validação do JS original) ---

  private validateFormat(): void {
    const parentInputField = this.inputElement.closest('.input-field');
    const maskFormat =
      this.maskService.format[this.maskType as keyof MaskService['format']];

    if (parentInputField) {
      // Remove estados de erro existentes
      parentInputField.classList.remove('error');
      const existingErrorDiv = parentInputField.querySelector('.error-message');
      existingErrorDiv?.remove();

      // Valida o formato
      if (
        this.inputElement.value &&
        maskFormat &&
        !maskFormat.test(this.inputElement.value)
      ) {
        parentInputField.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Formato inválido.';
        parentInputField.appendChild(errorDiv);
      }
    }
  }
}
