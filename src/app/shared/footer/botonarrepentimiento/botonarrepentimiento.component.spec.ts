import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonarrepentimientoComponent } from './botonarrepentimiento.component';

describe('BotonarrepentimientoComponent', () => {
  let component: BotonarrepentimientoComponent;
  let fixture: ComponentFixture<BotonarrepentimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonarrepentimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonarrepentimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
