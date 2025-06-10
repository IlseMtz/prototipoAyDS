import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloReportesComponent } from './modulo-reportes.component';

describe('ModuloReportesComponent', () => {
  let component: ModuloReportesComponent;
  let fixture: ComponentFixture<ModuloReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
