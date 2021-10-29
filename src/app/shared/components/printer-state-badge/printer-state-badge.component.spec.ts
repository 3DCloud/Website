import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterStateBadgeComponent } from './printer-state-badge.component';

describe('PrinterStateBadgeComponent', () => {
  let component: PrinterStateBadgeComponent;
  let fixture: ComponentFixture<PrinterStateBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterStateBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterStateBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
