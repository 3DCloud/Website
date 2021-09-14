import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrinterModalComponent } from './create-printer-modal.component';

describe('CreatePrinterModalComponent', () => {
  let component: CreatePrinterModalComponent;
  let fixture: ComponentFixture<CreatePrinterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePrinterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrinterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
