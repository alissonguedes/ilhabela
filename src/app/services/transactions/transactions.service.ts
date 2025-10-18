import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

import {
  BehaviorSubject,
  catchError,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

declare const M: any;

interface Transaction {
  id: number;
  valor: number;
  categoria_id?: string;
  conta_id?: string;
  data_baixa?: string;
  data_emissao?: string;
  data_vencimento?: string;
  descricao?: string;
  forma_pagamento?: string;
  observacoes?: string;
  status?: string;
  tipo?: string;
  user_id?: string;
}
@Injectable({
  providedIn: 'root',
})
export class TransactionsService extends HttpService {
  private refresh$ = new BehaviorSubject<void>(undefined);
  refreshObservable$ = this.refresh$.asObservable();

  private destroy$ = new Subject<void>();

  getTotal(transaction: Transaction[]): number {
    if (!transaction || transaction.length === 0) {
      return 0;
    }

    return transaction.reduce((acc, entry) => acc + entry.valor, 0);
  }

  totaliza(): Observable<{
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  }> {
    return forkJoin({
      entradas: this.getAll({ tipo: 'receber', periodo: '2025-10' }),
      saidas: this.getAll({ tipo: 'pagar', periodo: '2025-10' }),
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => {}),
      catchError((error: HttpErrorResponse) => {
        console.error(
          'Erro ao carregar entradas ou dados do mês anterior:',
          error
        );
        M.toast({ html: 'Erro ao carregar dados. Tente novamente.' });
        return of({ entradas: [], saidas: [] });
      }),
      map(({ entradas, saidas }) => {
        const totalEntradas = this.getTotal(entradas as Transaction[]);
        const totalSaidas = this.getTotal(saidas as Transaction[]);
        const saldo = Math.round((totalEntradas - totalSaidas) * 100) / 100;
        return {
          totalEntradas: totalEntradas,
          totalSaidas: totalSaidas,
          saldo: saldo,
        };
      })
    );
  }

  getAll(params?: any) {
    return this.get(`documentos-financeiros`, params);
  }

  notifyRefresh() {
    this.refresh$.next();
  }

  getId(id: number) {
    return this.get(`documentos-financeiros/${id}`);
  }

  insert(data: any) {
    return this.post(`documentos-financeiros`, data);
  }

  update(id: number, data: any) {
    return this.put(`documentos-financeiros/${id}`, data);
  }

  remove(id: number) {
    return this.delete(`documentos-financeiros/${id}`);
  }
}
