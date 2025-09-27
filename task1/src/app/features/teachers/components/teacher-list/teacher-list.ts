import { Component, computed } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import { TeacherCard } from '../teacher-card/teacher-card';

@Component({
  selector: 'app-teacher-list',
  imports: [TeacherCard],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css'
})
export class TeacherList {
  filteredTeachers;

  constructor(private teacherService: TeacherService) {
    this.filteredTeachers = this.teacherService.filteredTeachers;
  }
}
