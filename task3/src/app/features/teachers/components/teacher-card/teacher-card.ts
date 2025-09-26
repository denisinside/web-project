import { Component, Input } from '@angular/core';
import { Teacher } from '../../../../models/teacher.model';
import { TeacherService } from '../../../../shared/services/teacher';

@Component({
  selector: 'app-teacher-card',
  imports: [],
  templateUrl: './teacher-card.html',
  styleUrl: './teacher-card.css'
})
export class TeacherCard {
  @Input({ required: true }) teacher!: Teacher;

  constructor(private teacherService: TeacherService) {}

  onTeacherClick() {
    this.teacherService.openTeacherModal(this.teacher);
  }

  getInitials(): string {
    if (!this.teacher.full_name) return '??';
    const names = this.teacher.full_name.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    return this.teacherService.getInitials(firstName, lastName);
  }
}
