import {
  Directive,
  ElementRef,
  Input,
  forwardRef,
  AfterViewInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare const M: any;

@Directive({
  selector: '[datepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerDirective),
      multi: true,
    },
  ],
})
export class DatepickerDirective
  implements AfterViewInit, ControlValueAccessor
{
  private instance = M.Datepicker;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  /** Formato exibido no input (ex: dd/mm/yyyy, yyyy-mm-dd) */
  @Input() format: string = 'dd/mm/yyyy';

  /** Ativa dropdown de meses */
  @Input() selectMonths: boolean = true;

  /** Número de anos no seletor (pode ser number ou range ex: 15 ou 50) */
  @Input() selectYears: number | boolean = 15;

  private options: {} = {};
  private pendingValue: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.options = {
      format: this.format,
      i18n: {
        cancel: 'Cancelar',
        clear: 'Limpar',
        done: 'Ok',
        months: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],
        monthsShort: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ],
        weekdays: [
          'Domingo',
          'Segunda',
          'Terça',
          'Quarta',
          'Quinta',
          'Sexta',
          'Sábado',
        ],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      },
      setDefaultDate: false,
      defaultDate: this.el?.nativeElement.value
        ? new Date(this.el?.nativeElement.value.split('/').reverse().join('-'))
        : null,
      selectMonths: this.selectMonths,
      selectYears: 15,
      container: 'body',
      showClearBtn: true,
      autoClose: true,
      onSelect: (date: Date) => {
        /** A API deve receber datas formatadas sempre no padrão UTC para evitar problemas de fusos-horários. */
        const isoUtc = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        ).toISOString();
        this.el.nativeElement.value = isoUtc;
        this.onChange(isoUtc);
        this.onTouched();
      },
    };

    const instances = M.Datepicker.init(this.el.nativeElement, this.options);

    this.instance = Array.isArray(instances) ? instances[0] : instances;
  }

  writeValue(value: any): void {
    if (value && this.instance) {
      this.instance.setDate(value);
      this.el.nativeElement.value = this.instance.toString();
    } else {
      this.pendingValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private setDate(value: any) {
    if (!value) return;
    const date = new Date(value);
    this.instance.setDate(date);
    this.el.nativeElement.value = this.instance.toISOString();
  }
}

// declare interface DATEPICKER_OPTIONS {
// format: 'dd/mm/yyyy',
//   i18n: {
//     cancel: 'Cancelar',
//     clear: 'Limpar',
//     done: 'Ok',
//     setDefaultDate: true,
//     defaultDate: this.datepicker?.nativeElement.value
//       ? new Date(
//           this.datepicker?.nativeElement.value
//             .split('/')
//             .reverse()
//             .join('-')
//         )
//       : new Date(),
//     // selectMonths: true,
//     // selectYears: 15,
//     months: [
//       'Janeiro',
//       'Fevereiro',
//       'Março',
//       'Abril',
//       'Maio',
//       'Junho',
//       'Julho',
//       'Agosto',
//       'Setembro',
//       'Outubro',
//       'Novembro',
//       'Dezembro',
//     ],
//     monthsShort: [
//       'Jan',
//       'Fev',
//       'Mar',
//       'Abr',
//       'Mai',
//       'Jun',
//       'Jul',
//       'Ago',
//       'Set',
//       'Out',
//       'Nov',
//       'Dez',
//     ],
//     weekdays: [
//       'Domingo',
//       'Segunda',
//       'Terça',
//       'Quarta',
//       'Quinta',
//       'Sexta',
//       'Sábado',
//     ],
//     weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
//     weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
//   },
//   container: 'body',
//   showClearBtn: true,
//   autoClose: true,
//   onSelect: (date: Date) => {
//     // const formated = this.formatDate(date);
//     // this.entradasForm.getForm().get('data')?.setValue(formated);
//     // this.entradasForm.getForm().get('data')?.markAsTouched();
//     // this.entradasForm.getForm().get('data')?.markAsDirty();
//     // this.entradasForm.getForm().get('data')?.updateValueAndValidity();
//     // this.getForm().get(datepicker)
//     // console.log(datepicker?.attributes.get('name'));
//     this.dateChange.emit(date);
//     console.log(this, date);
//   },
// }
