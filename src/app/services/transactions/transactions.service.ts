import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpService } from '../http.service';

import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  forkJoin,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarService } from '../../shared/components/calendar/calendar.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

declare const M: any;
declare const document: any;

interface ITransaction {
  id: any;
  valor: number;
  categoria_id?: string;
  conta_id?: string;
  data_baixa?: string;
  data_emissao?: string;
  data_vencimento: string;
  descricao: string;
  forma_pagamento?: string;
  observacoes?: string;
  status?: string;
  tipo: string;
  user_id?: string;
  comprovantes?: [];
}

interface IDashboardData {
  entradas: ITransaction[];
  saidas: ITransaction[];
}
@Injectable({
  providedIn: 'root',
})
export class TransactionsService extends HttpService {
  private body = document.querySelector('body').classList;
  private calendar: CalendarService = inject(CalendarService);

  /**
   * Esta é a lógica principal para interagir com o back-end.
   */
  private _httpGetTransactions(param?: any): Observable<ITransaction[]> {
    let params = {
      ...param,
      periodo: this.calendar
        .getDate()
        .toLocaleDateString()
        .split('/')
        .reverse()
        .join('-')
        .substring(0, 7),
    };

    return this.get(`documentos-financeiros`, params).pipe(
      map((res: any): ITransaction[] => {
        return (res as ITransaction[]) || [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar transações:', error);
        if (typeof M !== 'undefined' && M.toast) {
          M.toast({
            html: 'Erro ao carregar dados do dashboard.',
            classes: 'red',
          });
        }
        return of([]);
      }),
      tap((transactions) =>
        console.log(
          `[HTTP Service] Dados brutos do período ${params.periodo} carregados: ${transactions.length} itens.`
        )
      )
    );
  }

  public readonly selectedDate = this.calendar.currentDate;
  private readonly refreshTrigger: WritableSignal<number> = signal(0);

  /**
   * Método público para notificar quando as informações forem atualizadas
   * (após salvar, editar ou remover uma transação).
   */
  public triggerRefresh(): void {
    this.refreshTrigger.update((n) => n + 1);
    console.log('[TransactionService] Gatilho de atualização forçado');
  }

  private readonly date$ = toObservable(this.selectedDate);
  private readonly refresh$ = toObservable(this.refreshTrigger).pipe(
    map(() => this.selectedDate())
  );

  private readonly combinedTrigger$: Observable<Date> = merge(
    this.date$,
    this.refresh$
  );

  private readonly dataLoading$: Observable<IDashboardData> =
    this.combinedTrigger$.pipe(
      switchMap((date) => {
        this.body.add('loading');

        // Chama a requisição HTTP com a data e processa o resultado
        return this._httpGetTransactions(date).pipe(
          tap((transactions: ITransaction[]) =>
            console.log(
              `[Service] Processando ${transactions.length} transações.`
            )
          ),
          map((transactions: ITransaction[]): IDashboardData => {
            // Tipagem clara do retorno do map
            const entradas: ITransaction[] = [];
            const saidas: ITransaction[] = [];

            transactions.forEach((t) => {
              // Garante que 'tipo' exista e seja 'receber' ou 'pagar'
              if (t.tipo === 'receber') {
                entradas.push(t);
              } else if (t.tipo === 'pagar') {
                saidas.push(t);
              }
            });

            this.body.remove('loading');

            return { entradas, saidas };
          })
        );
      }),
      shareReplay(1) // Garante que a requisição HTTP só seja feita uma vez e o resultado seja compartilhado.
    );

  private readonly transactionData: WritableSignal<IDashboardData> = toSignal(
    this.dataLoading$,
    {
      initialValue: { entradas: [], saidas: [] } as IDashboardData,
    }
  ) as WritableSignal<IDashboardData>;

  public readonly entradasList = computed(
    () => this.transactionData().entradas
  );
  public readonly saidasList = computed(() => this.transactionData().saidas);

  public readonly totalEntradas = computed(() => {
    return this.transactionData().entradas.reduce(
      (sum: number, item: ITransaction) => sum + (item.valor || 0),
      0
    );
  });

  public readonly totalSaidas = computed(() => {
    return this.transactionData().saidas.reduce(
      (sum: number, item: ITransaction) => sum + (item.valor || 0),
      0
    );
  });

  public readonly totalSaldo = computed(() => {
    return this.totalEntradas() - this.totalSaidas();
  });

  // CRUD

  getAll(params?: any): Observable<ITransaction[]> {
    return this._httpGetTransactions(params);
  }

  getId(id: number) {
    return this.get(`documentos-financeiros/${id}`);
  }

  insert(data: any) {
    this.body.add('loading');
    return super.post(`documentos-financeiros`, data).pipe(
      tap((newDoc) => {
        this.triggerRefresh();
      })
    );
  }

  update(id: number, data: any) {
    this.body.add('loading');
    return super.put(`documentos-financeiros/${id}`, data).pipe(
      tap((updatedDoc) => {
        this.triggerRefresh();
      })
    );
  }

  remove(id: number) {
    this.body.add('loading');
    return super.delete(`documentos-financeiros/${id}`).pipe(
      tap(() => {
        this.triggerRefresh();
      })
    );
  }
}
