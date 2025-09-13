import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherFilters } from './teacher-filters';

describe('TeacherFilters', () => {
  let component: TeacherFilters;
  let fixture: ComponentFixture<TeacherFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
