import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCancellationReasonComponent } from './edit-cancellation-reason.component';

describe('EditCancellationReasonComponent', () => {
  let component: EditCancellationReasonComponent;
  let fixture: ComponentFixture<EditCancellationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCancellationReasonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCancellationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
