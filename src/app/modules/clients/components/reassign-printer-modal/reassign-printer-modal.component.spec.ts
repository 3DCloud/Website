import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignPrinterModalComponent } from './reassign-printer-modal.component';

describe('ReassignPrinterModalComponent', () => {
  let component: ReassignPrinterModalComponent;
  let fixture: ComponentFixture<ReassignPrinterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReassignPrinterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignPrinterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
