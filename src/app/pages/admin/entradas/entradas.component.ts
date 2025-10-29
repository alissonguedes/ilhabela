import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { EntradasForm } from './entradas.form';
import { TransactionsService } from '../../../services/transactions/transactions.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

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
export class EntradasComponent {
  @ViewChild(EntradasForm) entradasForm!: EntradasForm;

  entradas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private transactionsService = inject(TransactionsService);
  public readonly totalEntradas = this.transactionsService.totalEntradas;
  public readonly entradasList = this.transactionsService.entradasList;
}
