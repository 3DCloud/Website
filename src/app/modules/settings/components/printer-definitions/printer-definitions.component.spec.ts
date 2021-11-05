import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterDefinitionsComponent } from './printer-definitions.component';

describe('PrinterDefinitionsComponent', () => {
  let component: PrinterDefinitionsComponent;
  let fixture: ComponentFixture<PrinterDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterDefinitionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
