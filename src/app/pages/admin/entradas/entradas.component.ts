import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { EntradasForm } from './entradas.form';
import { TransactionsService } from '../../../services/transactions/transactions.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { AuthService } from '../../../services/auth/auth.service';

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
export class EntradasComponent implements AfterViewInit {
  @ViewChild(EntradasForm) entradasForm!: EntradasForm;
  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;

  entradas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private transactionsService = inject(TransactionsService);
  public readonly totalEntradas = this.transactionsService.totalEntradas;
  public readonly entradasList = this.transactionsService.entradasList;

  group: string = '';

  constructor(private auth: AuthService) {
    this.group = this.auth.getUserGroup();
  }

  ngAfterViewInit() {
    this.dropdown.changes.subscribe(() => {
      this.initDropdowns();
    });
  }

  private initDropdowns() {
    const dropdownElem = this.dropdown;
    const config = { alignment: 'right', container: 'body' };
    dropdownElem.forEach((item: ElementRef<any>) => {
      M.Dropdown.init(item.nativeElement, config);
    });
  }
}
