import { Component, effect, inject, signal } from '@angular/core';

import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private calendar: CalendarService = inject(CalendarService);
  day!: string;
  month!: string;
  year!: number;
  editing = signal<'month' | 'year' | null>(null);
  currentDate = this.calendar.currentDate;

  readonly months = [
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
  ];

  prevMonth() {
    this.calendar.prevMonth();
  }

  nextMonth() {
    this.calendar.nextMonth();
  }

  setMonth(monthIndex: number) {
    const d = new Date(this.currentDate());
    d.setMonth(monthIndex);
    this.calendar.setDate(d);
    this.editing.set(null);
  }

  getMonth(): string {
    return (this.month = this.currentDate().toLocaleDateString('pt-br', {
      month: 'long',
    }));
  }

  setYear(year: number) {
    const d = new Date(this.currentDate());
    d.setFullYear(year);
    this.calendar.setDate(d);
    this.editing.set(null);
  }

  getYear(): number {
    return (this.year = this.currentDate().getFullYear());
  }

  get yearRange(): number[] {
    const current = this.currentDate().getFullYear();
    return Array.from({ length: 11 }, (_, i) => current - 5 + i);
  }
}
