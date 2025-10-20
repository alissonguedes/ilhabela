import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { EntradasForm } from './entradas.form';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

declare const M: any;

@Component({
  selector: 'app-entradas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EntradasForm,
    CurrencyFormatPipe,
  ],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.scss',
})
export class EntradasComponent implements OnInit, OnDestroy {
  @ViewChild(EntradasForm) entradasForm!: EntradasForm;

  entradas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private periodo = new Date().toISOString();
  private params = {
    tipo: 'receber',
    periodo: `${this.periodo.substring(0, 7)}`,
  };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.transactionsService.getAll(this.params).subscribe({
      next: (res: any) => {
        this.entradas$.next(res);
      },
      error: (err) => {},
    });
  }

  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}

export { TransactionsService as transaction };
