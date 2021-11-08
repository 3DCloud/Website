import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterDefinitionComponent } from './printer-definition.component';

describe('PrinterDefinitionComponent', () => {
  let component: PrinterDefinitionComponent;
  let fixture: ComponentFixture<PrinterDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterDefinitionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
