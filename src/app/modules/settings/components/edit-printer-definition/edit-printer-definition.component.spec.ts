import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrinterDefinitionComponent } from './edit-printer-definition.component';

describe('PrinterDefinitionComponent', () => {
  let component: EditPrinterDefinitionComponent;
  let fixture: ComponentFixture<EditPrinterDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPrinterDefinitionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrinterDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
