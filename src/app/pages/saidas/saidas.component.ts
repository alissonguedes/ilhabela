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

import { SaidasForm } from './saidas.form';
import { TransactionsService } from '../../services/transactions/transactions.service';

declare const M: any;

@Component({
  selector: 'app-saidas',
  imports: [CommonModule, ReactiveFormsModule, SaidasForm],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.scss',
})
export class SaidasComponent implements OnInit, OnDestroy {
  @ViewChild(SaidasForm) saidasForm!: SaidasForm;

  saidas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private periodo = new Date().toISOString();
  private params = {
	tipo: 'pagar',
	periodo: `${this.periodo.substring(0, 7)}`,
  };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
	this.transactionsService.getAll(this.params).subscribe({
	  next: (res: any) => {
		this.saidas$.next(res);
	  },
	  error: (err) => {},
	});
  }

  ngOnDestroy(): void {}

  getTotal() {}
}
