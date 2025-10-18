import { Injectable } from '@angular/core';

// Definição de um tipo para uma função de máscara
type MaskFunction = (v: string) => string;

// Definição de um tipo para as funções auxiliares que não são máscaras
type HelperFunction = (v: any) => any;

// Definição do tipo para o objeto masker
interface Masker {
  numeric: MaskFunction;
  decimal: MaskFunction;
  cpf: MaskFunction;
  cnpj: MaskFunction;
  cpfcnpj: MaskFunction;
  date: MaskFunction;
  time: MaskFunction;
  phone: MaskFunction;
  celular: MaskFunction;
  cep: MaskFunction;
  credit_card: MaskFunction;
  string: MaskFunction;
  isNumeric: HelperFunction; // Não é uma MaskFunction, mas uma HelperFunction
  normalizeValue: HelperFunction;
  // Adicione outras chaves que retornam funções de máscara
}

@Injectable({
  providedIn: 'root',
})
export class MaskService {
  // As definições de maxlength
  public maxlength = {
    cep: 9,
    cnpj: 18,
    cpf: 14,
    cpfcnpj: 18,
    date: 10,
    email: null,
    time: 8,
    credit_card: 19,
    phone: 15,
    celular: 16,
    decimal: null,
  };

  // As definições de formato
  public format = {
    cep: /^(\d{5}-\d{3})$/,
    cnpj: /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
    cpf: /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/,
    date: /^((0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/, // DD/MM/YYYY
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    time: /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/,
    credit_card: /^(\d{4}\s){3}\d{4}$/,
    decimal: /^\d{1,3}(\.\d{3})*,\d{2}$/,
  };

  public masker: Masker = {
    numeric: (v: string): string => {
      return String(v).replace(/\D/g, '');
    },

    // FUNÇÃO DECIMAL AJUSTADA
    decimal: (v: string): string => {
      // 1. Limpa TUDO: "R$ 1.234,56" ou "1234.56" se torna "123456"
      v = String(v).replace(/\D/g, '');

      if (v.length === 0) return '0,00';
      v = v.replace(/^0+/, ''); // Remove zeros iniciais
      if (v.length === 0) return '0,00';

      if (v.length === 1) return `0,0${v}`;
      if (v.length === 2) return `0,${v}`;

      let integerPart = v.slice(0, -2); // Ex: "1234"
      let decimalPart = v.slice(-2); // Ex: "56"

      // 2. Adiciona PONTOS como separadores de milhar (BR)
      // Ex: "1234" se torna "1.234"
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // 3. Retorna o valor formatado com VÍRGULA decimal (BR)
      return `${integerPart},${decimalPart}`;
    },

    cpf: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return v;
    },

    // ... (Implementar as outras funções de máscara como cnpj, date, phone, etc. usando this.masker.numeric)

    cnpj: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/(\d{2})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1/$2');
      v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
      return v;
    },

    cpfcnpj: (v: string): string => {
      v = this.masker.numeric(v);
      if (v.length <= 11) {
        return this.masker.cpf(v);
      } else {
        return this.masker.cnpj(v);
      }
    },

    date: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/(\d{2})(\d)/, '$1/$2');
      v = v.replace(/(\d{2})(\d)/, '$1/$2');
      return v;
    },

    time: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/(\d{2})(\d)/, '$1:$2');
      v = v.replace(/(\d{2})(\d)/, '$1:$2');
      return v;
    },

    phone: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      if (v.length > 14) {
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
      } else {
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
      }
      return v;
    },

    celular: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
      return v;
    },

    cep: (v: string): string => {
      v = this.masker.numeric(v);
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
      return v;
    },

    credit_card: (v: string): string => {
      v = this.masker.numeric(v);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      return parts.join(' ');
    },

    string: (v: string): string => {
      return String(v);
    },

    isNumeric: (char: string): boolean => {
      return /^\d$/.test(char);
    },

    // FUNÇÃO QUE GERA O VALOR LIMPO PARA O MODEL
    normalizeValue: (val: string): string => {
      if (!val) return '0.00';
      // Remove TODOS os pontos (separadores de milhar BR) e troca a VÍRGULA (separador decimal BR) por PONTO (separador decimal US)
      return val.replace(/\./g, '').replace(',', '.');
    },
  };
}
