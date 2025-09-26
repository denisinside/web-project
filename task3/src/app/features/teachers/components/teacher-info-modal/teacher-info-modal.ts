import { Component } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';

@Component({
  selector: 'app-teacher-info-modal',
  imports: [],
  templateUrl: './teacher-info-modal.html',
  styleUrl: './teacher-info-modal.css'
})
export class TeacherInfoModal {
  isVisible;
  selectedTeacher;

  constructor(private teacherService: TeacherService) {
    this.isVisible = this.teacherService.isModalVisible;
    this.selectedTeacher = this.teacherService.selectedTeacher;
  }

  closeModal() {
    this.teacherService.closeTeacherModal();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  toggleFavorite() {
    this.teacherService.toggleFavoriteInModal();
  }

  getInitials(): string {
    const teacher = this.selectedTeacher();
    if (teacher && teacher.full_name) {
      const names = teacher.full_name.split(' ');
      const firstName = names[0] || '';
      const lastName = names[names.length - 1] || '';
      return this.teacherService.getInitials(firstName, lastName);
    }
    return '??';
  }
}
