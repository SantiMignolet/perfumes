import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestraempresaComponent } from './nuestraempresa.component';

describe('NuestraempresaComponent', () => {
  let component: NuestraempresaComponent;
  let fixture: ComponentFixture<NuestraempresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestraempresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestraempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
