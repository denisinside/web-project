import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() teacherSelected = new EventEmitter<Teacher>();

  constructor(private teacherService: TeacherService) {}

  onTeacherClick() {
    this.teacherSelected.emit(this.teacher);
  }

  getInitials(): string {
    return this.teacherService.getInitials(this.teacher.firstName, this.teacher.lastName);
  }
}
