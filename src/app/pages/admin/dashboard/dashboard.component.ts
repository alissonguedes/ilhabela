import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvisosComponent } from '../avisos/avisos.component';
import { EntradasComponent } from '../entradas/entradas.component';
import { SaidasComponent } from '../saidas/saidas.component';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { TransactionsService } from '../../../services/transactions/transactions.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

declare const M: any;

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AvisosComponent,
    EntradasComponent,
    SaidasComponent,
    CalendarComponent,
    CurrencyFormatPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private transactionsService = inject(TransactionsService);

  // Mapeia os signals do serviço para propriedades do componente
  public readonly totalEntradas = this.transactionsService.totalEntradas;
  public readonly totalSaidas = this.transactionsService.totalSaidas;
  public readonly totalSaldo = this.transactionsService.totalSaldo;
}
