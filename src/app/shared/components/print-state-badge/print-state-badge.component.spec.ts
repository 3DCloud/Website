import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStateBadgeComponent } from './print-state-badge.component';

describe('PrintStateBadgeComponent', () => {
  let component: PrintStateBadgeComponent;
  let fixture: ComponentFixture<PrintStateBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintStateBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStateBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
