import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BehaviorSubject } from 'rxjs';

import { SaidasForm } from './saidas.form';
import { TransactionsService } from '../../../services/transactions/transactions.service';

declare const M: any;

@Component({
  selector: 'app-saidas',
  imports: [CommonModule, ReactiveFormsModule, SaidasForm, PdfViewerModule],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.scss',
})
export class SaidasComponent implements AfterViewInit {
  @ViewChild(SaidasForm) saidasForm!: SaidasForm;
  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;
  @ViewChild('modalComprovante') modalComprovante!: ElementRef;

  fileType: string = '';
  fileLink: string = '';
  fileName: string = '';
  fileData: string = '';

  previewUrl: string | null = null;
  filePreview = signal(false);

  saidas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private transactionsService = inject(TransactionsService);
  public readonly totalSaidas = this.transactionsService.totalSaidas;
  public readonly saidasList = this.transactionsService.saidasList;

  ngAfterViewInit() {
    this.dropdown.changes.subscribe(() => {
      this.initDropdowns();
    });
  }

  utf8Decode(fileData: string) {
    // Decodifica Base64 corretamente como UTF-8
    const decoded = decodeURIComponent(
      Array.prototype.map
        .call(atob(fileData), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return decoded;
  }

  openModalComprovante(comprovantes: any): void {
    const modalElement = this.modalComprovante.nativeElement;
    let modal = M.Modal.getInstance(modalElement);

    if (!modal) {
      // Inicializa o modal (se ainda não estiver)
      modal = M.Modal.init(modalElement, {
        onCloseStart: () => {
          this.resetModalContent();
        },
      });
    }

	console.log(comprovantes);

    // Verifica se há arquivo a ser listado na variável `comprovantes`
    // Se não houver, deverá apresentar a seção `Arquivos Inválidos ou Corrompidos`
    if (comprovantes.join().trim() !== '') {
      const comprovante = comprovantes[0];
      this.fileType = comprovante.type;
      this.fileName = comprovante.name;
      this.fileData = this.prepareFileData(comprovante);
      this.previewUrl = this.preparePreviewUrl(comprovante);
    }

    modal.open();
  }

  /**
   * Função para redefinir todos os atributos do modal de exibição de comprovantes
   * Isto é importante porque garante que o ng2-pdf-viewer não tentará renderizar o PDF antigo
   * enquanto o novo é carregado, evitando consumo de memória desnecessariamente.
   */
  resetModalContent(): void {
    this.fileName = '';
    this.fileData = '';
    this.fileType = '';
    this.previewUrl = '';
  }

  /**
   * Gera a base64 ou texto legível conforme tipo MIME
   */
  prepareFileData(comprovante: any): string {
    if (comprovante.type.startsWith('image/')) {
      this.filePreview.set(true);
      return comprovante.data;
    }

    if (comprovante.type === 'application/pdf') {
      this.filePreview.set(true);
      return `data:application/pdf;base64,${comprovante.data}`;
    }

    if (comprovante.type.startsWith('text/')) {
      this.filePreview.set(true);
      return this.utf8Decode(comprovante.data);
    }

    this.filePreview.set(false);

    // Mantém base64 padrão para outros tipos
    return `data:${comprovante.type};base64,${comprovante.data}`;
  }

  /**
   * Define qual URL será usada para exibição no iframe
   */
  preparePreviewUrl(comprovante: any): string | null {
    const mime = comprovante.type;
    const base64Url = `data:${mime};base64,${comprovante.data}`;

    // PDF e imagem — preview direto
    if (mime.startsWith('image/') || mime === 'application/pdf') {
      return base64Url;
    }

    // Texto puro — preview dentro de <pre>
    if (mime.startsWith('text/')) {
      return null; // Exibido no <pre> direto
    }

    // Extensões que podem ser abertas via Google Docs Viewer
    const supportedOfficeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/msword', // .doc
      'application/vnd.ms-excel', // .xls
      'text/csv',
    ];

    if (supportedOfficeTypes.includes(mime)) {
      // Criamos uma URL blob temporária para abrir via Google Docs Viewer
      const blob = this.base64ToBlob(comprovante.data, mime);
      const blobUrl = URL.createObjectURL(blob);
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        blobUrl
      )}`;
    }

    // Outros tipos (zip, rar, etc.) não suportados
    return null;
  }

  /**
   * Converte base64 para Blob (necessário para Google Docs Viewer)
   */
  base64ToBlob(base64: string, mime: string): Blob {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  /**
   * Baixa o arquivo localmente
   */
  downloadFile(): void {
    if (!this.fileData || !this.fileName) {
      M.toast({ html: 'Nenhum arquivo disponível para download.' });
      return;
    }

    const link = document.createElement('a');

    if (this.fileType.startsWith('text/')) {
      const blob = new Blob([this.fileData], { type: this.fileType });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = this.fileData;
    }

    link.download = this.fileName;
    link.target = '_blank';
    link.click();

    setTimeout(() => {
      if (link.href.startsWith('blob:')) URL.revokeObjectURL(link.href);
    }, 1000);
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
}
