import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeacherModal } from './add-teacher-modal';

describe('AddTeacherModal', () => {
  let component: AddTeacherModal;
  let fixture: ComponentFixture<AddTeacherModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeacherModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeacherModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
