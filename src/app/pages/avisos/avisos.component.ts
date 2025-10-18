import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { AvisosForm } from './avisos.form';
import { NotesService } from '../../services/notes/notes.service';

declare const M: any;

@Component({
  selector: 'app-avisos',
  imports: [CommonModule, DialogComponent, AvisosForm],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss',
})
export class AvisosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AvisosForm) avisosForm!: AvisosForm;
  @ViewChild(DialogComponent) modalDialog!: DialogComponent;
  @ViewChildren('dropdown') dropdown!: QueryList<ElementRef>;

  avisos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notesService.getAll().subscribe({
      next: (res: any) => {
        this.avisos$.next(res);
      },
    });
  }

  ngOnDestroy(): void {}

  ngAfterViewInit() {
    this.dropdown.changes.subscribe(() => {
      this.initDropdowns();
    });
  }

  private initDropdowns() {
    const dropdownElem = this.dropdown;
    const config = { alignment: 'right', container: 'body' };
    dropdownElem.forEach((item: ElementRef<any>) => {
      console.log(dropdownElem);
      M.Dropdown.init(item.nativeElement, config);
    });
  }

  removeAviso(id: number) {
    // 1. Chama o método open, passando a mensagem
    this.modalDialog
      .open(
        'Tem certeza que você deseja excluir este registro?',
        'Atenção: Ação Irreversível'
      )
      .subscribe((confirmed: boolean) => {
        // 2. Assina o Observable para receber o resultado
        if (confirmed) {
          const valuesBkp = [...this.avisos$.value];
          const filtrados = valuesBkp.filter((item) => item.id !== id);

          this.avisos$.next(filtrados);

          this.notesService.remove(id).subscribe({
            next: (response: any) => {
              M.toast({ html: response.message });
              this.notesService.notifyRefresh();
            },
            error: (error: any) => {
              this.avisos$.next(valuesBkp);
              M.toast({ html: error.message });
            },
          });
        } else {
          console.log('❌ Usuário CANCELOU! Nenhuma ação realizada.');
        }
      });
  }
}
