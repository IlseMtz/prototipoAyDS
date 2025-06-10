import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloVentasComponent } from './modulo-ventas.component';

describe('ModuloVentasComponent', () => {
  let component: ModuloVentasComponent;
  let fixture: ComponentFixture<ModuloVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
