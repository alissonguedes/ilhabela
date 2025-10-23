import {
  AfterViewInit,
  Component,
  ElementRef,
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

import { SaidasForm } from './saidas.form';
import { TransactionsService } from '../../services/transactions/transactions.service';

declare const M: any;

@Component({
  selector: 'app-saidas',
  imports: [CommonModule, ReactiveFormsModule, SaidasForm],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.scss',
})
export class SaidasComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(SaidasForm) saidasForm!: SaidasForm;
  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;

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

  ngAfterViewInit() {
    this.dropdown.changes.subscribe(() => {
      this.initDropdowns();
    });
  }

  @ViewChild('modalComprovante') modalComprovante!: ElementRef;

  fileType: string = '';
  fileLink: string = '';
  fileName: string = '';
  fileData: string = '';

  openModalComprovante(comprovantes: any[]) {
    const modalElement = this.modalComprovante.nativeElement;
    const modalContent = modalElement.querySelector(
      '.modal-content'
    ) as HTMLDivElement;

    // Limpa o conteúdo anterior
    // modalContent.innerHTML = '';

    // Monta o HTML de todos os comprovantes
    let html = '';

    for (const c of comprovantes) {
      if (!c || !c.type || !c.data) continue;

      //   const safeName = c.name || 'comprovante';
      //   const safeType = c.type;

      this.fileName = c.name;
      this.fileType = c.type;
      this.fileData = c.type.startsWith('text/') ? atob(c.data) : c.data;

      console.log(this.fileData, this.fileName, this.fileType);

      //   if (safeType.startsWith('image/')) {
      //     html += `
      //     <div class="center-align" style="margin-bottom: 1rem">
      //       <img src="${c.data}" alt="${safeName}" width="300">
      //     </div>`;
      //   } else if (safeType === 'application/pdf') {
      //     html += `
      //     <div class="center-align" style="margin-bottom: 1rem">
      //       <iframe src="data:${safeType};base64,${c.data}" width="400" height="500"></iframe>
      //     </div>`;
      //   } else if (safeType.startsWith('text/')) {
      //     const decoded = atob(c.data);
      //     html += `
      //     <div class="left-align">
      //       <h6 class="white-text">${safeName}</h6>
      //       <pre style="padding: 20px; max-width: 100%; position: relative; white-space: normal; background: #fff; color: #000; display: flex; align-items: center; place-content: center; justify-content: center; width: 100%; flex: 1 100%;">${decoded}</pre>
      //     </div>`;
      //   } else {
      //     html += `
      //     <div class="center-align" style="margin: 1rem;">
      //       <a href="data:${safeType};base64,${c.data}" download="${safeName}" class="btn blue">
      //         <i class="material-symbols-outlined left">download</i>
      //         Baixar ${safeName}
      //       </a>
      //     </div>`;
      //   }
    }

    // Atribui o HTML completo de uma vez
    // modalContent.innerHTML = html;

    // Inicializa o modal (se ainda não estiver)
    let modal = M.Modal.getInstance(modalElement);
    if (!modal) modal = M.Modal.init(modalElement);

    // Abre o modal
    modal.open();
  }

  private initDropdowns() {
    const dropdownElem = this.dropdown;
    const config = { alignment: 'right', container: 'body' };
    dropdownElem.forEach((item: ElementRef<any>) => {
      M.Dropdown.init(item.nativeElement, config);
    });
  }

  iframeSupported(type: string): boolean {
    return type.startsWith('image/') || type === 'application/pdf';
  }

  getTotal() {}
}
