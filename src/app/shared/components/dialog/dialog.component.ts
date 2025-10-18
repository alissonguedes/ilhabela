import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { Observable, Observer } from 'rxjs';

declare const M: any;

@Component({
  selector: 'x-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements AfterViewInit {
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  private materializeModalInstance: any;

  public title: string = 'Confirmação';
  public message: string = 'Tem certeza que deseja continuar com esta ação?';

  ngAfterViewInit() {
    const modalDialog = this.modalDialog.nativeElement;
    this.materializeModalInstance = M.Modal.init(modalDialog, {
      dismissible: false,
    });
  }

  /**
   * Abre o modal e retorna um Observable que emite true ou false.
   * @param message Mensagem de confirmação opcional.
   * @returns Observable<boolean> (true para Confirmar, false para Cancelar).
   */
  open(message?: string, title?: string): Observable<boolean> {
    if (message) this.message = message;
    if (title) this.title = title;

    // Retorna um Observable que encapsula a lógica de abertura/fechamento
    return new Observable((observer: Observer<boolean>) => {
      // Armazena a referência ao observer para usar nos métodos de clique
      (this.materializeModalInstance as any).observer = observer;

      // Abre o modal
      this.materializeModalInstance.open();
    });
  }

  /**
   * Chamado ao clicar em 'Confirmar'.
   * Completa o Observable com 'true' e fecha o modal.
   */
  confirm() {
    // Obtém o observer e emite 'true'
    const observer = (this.materializeModalInstance as any)
      .observer as Observer<boolean>;
    if (observer) {
      observer.next(true); // Emite o valor
      observer.complete(); // Fecha o Observable
    }
    this.materializeModalInstance.close();
  }

  /**
   * Chamado ao clicar em 'Cancelar'.
   * Completa o Observable com 'false' e fecha o modal.
   */
  cancel() {
    // Obtém o observer e emite 'false'
    const observer = (this.materializeModalInstance as any)
      .observer as Observer<boolean>;
    if (observer) {
      observer.next(false); // Emite o valor
      observer.complete(); // Fecha o Observable
    }
    this.materializeModalInstance.close();
  }
}
