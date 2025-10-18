import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvisosComponent } from '../avisos/avisos.component';
import { EntradasComponent, transaction } from '../entradas/entradas.component';
import { SaidasComponent } from '../saidas/saidas.component';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

declare const M: any;

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AvisosComponent, EntradasComponent, SaidasComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  totalEntradas: string | number = 0;
  totalSaidas: string | number = 0;
  totalSaldo: string | number = 0;

  constructor(protected auth: AuthService, private transaction: transaction) {}

  ngOnInit(): void {
    this.getTotais();
    this.transaction.refreshObservable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getTotais());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTotais() {
    this.transaction.totaliza().subscribe({
      next: (total) => {
        this.totalEntradas = this.converteValor(total.totalEntradas);
        this.totalSaidas = this.converteValor(total.totalSaidas);
        this.totalSaldo = this.converteValor(total.saldo);
      },
    });
  }

  converteValor(valor: number, contabil: boolean = false): string {
    if (isNaN(valor)) return '0,00';

    if (contabil) {
      const valorAbsoluto = Math.abs(valor);
      const formatado = valorAbsoluto.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valor < 0 ? `(${formatado})` : formatado;
    }

    // Se não for contabil, retorna o valor formatado normalmente
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
