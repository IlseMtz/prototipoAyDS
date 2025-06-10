import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarExistenciasComponent } from './consultar-existencias.component';

describe('ConsultarExistenciasComponent', () => {
  let component: ConsultarExistenciasComponent;
  let fixture: ComponentFixture<ConsultarExistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarExistenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarExistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
