import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterButtonComponent } from './printer-button.component';

describe('PrinterButtonComponent', () => {
  let component: PrinterButtonComponent;
  let fixture: ComponentFixture<PrinterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
