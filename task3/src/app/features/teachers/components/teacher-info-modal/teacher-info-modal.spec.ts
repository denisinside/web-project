import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInfoModal } from './teacher-info-modal';

describe('TeacherInfoModal', () => {
  let component: TeacherInfoModal;
  let fixture: ComponentFixture<TeacherInfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherInfoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
