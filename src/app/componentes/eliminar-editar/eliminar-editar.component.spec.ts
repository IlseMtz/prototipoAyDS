import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEditarComponent } from './eliminar-editar.component';

describe('EliminarEditarComponent', () => {
  let component: EliminarEditarComponent;
  let fixture: ComponentFixture<EliminarEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
