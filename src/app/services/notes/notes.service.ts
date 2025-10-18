import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService extends HttpService {
  private refresh$ = new BehaviorSubject<void>(undefined);
  refreshObservable$ = this.refresh$.asObservable();

  private destroy$ = new Subject<void>();

  notifyRefresh() {
    this.refresh$.next();
  }

  getAll(params?: any) {
    return this.get(`notes`, params);
  }

  getId(id: number) {
    return this.get(`notes/${id}`);
  }

  insert(data: any) {
    return this.post(`notes`, data);
  }

  update(id: number, data: any) {
    return this.put(`notes/${id}`, data);
  }

  remove(id: number) {
    return this.delete(`notes/${id}`);
  }
}
