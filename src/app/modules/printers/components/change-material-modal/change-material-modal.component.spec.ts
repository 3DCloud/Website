import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMaterialModalComponent } from './change-material-modal.component';

describe('ChangeMaterialModalComponent', () => {
  let component: ChangeMaterialModalComponent;
  let fixture: ComponentFixture<ChangeMaterialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeMaterialModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
