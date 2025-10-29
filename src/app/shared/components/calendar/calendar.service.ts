import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  currentDate = signal(new Date());

  setDate(date: Date) {
    this.currentDate.set(date);
  }

  nextMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
  }

  prevMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
  }

  getDate(): Date {
    return this.currentDate();
  }

  getDateUTC(): string {
    return this.getDate().toUTCString();
  }
}
