import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialComponent } from './edit-material.component';

describe('MaterialComponent', () => {
  let component: EditMaterialComponent;
  let fixture: ComponentFixture<EditMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMaterialComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
