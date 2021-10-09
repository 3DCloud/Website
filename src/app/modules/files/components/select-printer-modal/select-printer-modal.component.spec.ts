import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPrinterModalComponent } from './select-printer-modal.component';

describe('SelectPrinterModalComponent', () => {
  let component: SelectPrinterModalComponent;
  let fixture: ComponentFixture<SelectPrinterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPrinterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPrinterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
