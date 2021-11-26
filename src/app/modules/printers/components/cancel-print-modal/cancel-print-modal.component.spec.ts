import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPrintModalComponent } from './cancel-print-modal.component';

describe('CancelPrintModalComponent', () => {
  let component: CancelPrintModalComponent;
  let fixture: ComponentFixture<CancelPrintModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelPrintModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelPrintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
