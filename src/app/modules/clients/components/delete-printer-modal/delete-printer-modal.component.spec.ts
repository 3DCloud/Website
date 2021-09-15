import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrinterModalComponent } from './delete-printer-modal.component';

describe('DeletePrinterModalComponent', () => {
  let component: DeletePrinterModalComponent;
  let fixture: ComponentFixture<DeletePrinterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePrinterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePrinterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
