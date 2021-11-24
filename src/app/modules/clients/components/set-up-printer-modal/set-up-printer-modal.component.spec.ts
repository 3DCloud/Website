import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpPrinterModalComponent } from './set-up-printer-modal.component';

describe('ReassignPrinterModalComponent', () => {
  let component: SetUpPrinterModalComponent;
  let fixture: ComponentFixture<SetUpPrinterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetUpPrinterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpPrinterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
