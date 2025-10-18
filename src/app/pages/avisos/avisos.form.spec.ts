import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisosForm } from './avisos.form';

describe('AvisosForm', () => {
  let component: AvisosForm;
  let fixture: ComponentFixture<AvisosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
