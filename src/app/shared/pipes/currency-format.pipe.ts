import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    accounting: boolean = false
  ): string {
    // Converte para número seguro
    let num = 0;

    if (value === null || value === undefined || value === '') {
      num = 0;
    } else if (typeof value === 'string') {
      // Substitui vírgula por ponto se for string
      num = parseFloat(value.replace(',', '.'));
      if (isNaN(num)) num = 0;
    } else {
      num = value;
    }

    if (accounting) {
      const abs = Math.abs(num);
      const formatted = abs.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return num < 0 ? `(${formatted})` : formatted;
    }

    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
