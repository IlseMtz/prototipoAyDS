import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSalidasComponent } from './registrar-salidas.component';

describe('RegistrarSalidasComponent', () => {
  let component: RegistrarSalidasComponent;
  let fixture: ComponentFixture<RegistrarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSalidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
