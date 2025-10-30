import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { TransactionsService } from '../../../services/transactions/transactions.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { AvisosComponent } from '../../admin/avisos/avisos.component';
import { EntradasComponent } from '../../admin/entradas/entradas.component';
import { SaidasComponent } from '../../admin/saidas/saidas.component';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
@Component({
  selector: 'app-home',
  imports: [
    CurrencyFormatPipe,
    AvisosComponent,
    EntradasComponent,
    SaidasComponent,
    CalendarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  day = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  month = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  date: Date = new Date();
  private transactionsService = inject(TransactionsService);

  totalEntradas = this.transactionsService.totalEntradas;
  totalSaidas = this.transactionsService.totalSaidas;
  totalSaldo = this.transactionsService.totalSaldo;

  constructor(private auth: AuthService) {}
  logout() {
    this.auth.logout();
  }
}
