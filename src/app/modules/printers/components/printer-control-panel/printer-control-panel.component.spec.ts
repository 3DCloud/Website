import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterControlPanelComponent } from './printer-control-panel.component';

describe('PrinterComponent', () => {
  let component: PrinterControlPanelComponent;
  let fixture: ComponentFixture<PrinterControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterControlPanelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
