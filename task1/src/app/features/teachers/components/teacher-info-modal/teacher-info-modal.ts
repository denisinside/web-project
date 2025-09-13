import { Component, signal, OnInit } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import { Teacher } from '../../../../models/teacher.model';

@Component({
  selector: 'app-teacher-info-modal',
  imports: [],
  templateUrl: './teacher-info-modal.html',
  styleUrl: './teacher-info-modal.css'
})
export class TeacherInfoModal implements OnInit {
  isVisible = signal(false);
  selectedTeacher = signal<Teacher | null>(null);

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {

    document.addEventListener('openTeacherInfoModal', (event: any) => {
      this.openModal(event.detail);
    });
  }

  openModal(teacher: Teacher) {
    this.selectedTeacher.set(teacher);
    this.isVisible.set(true);
  }

  closeModal() {
    this.isVisible.set(false);
    this.selectedTeacher.set(null);
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  toggleFavorite() {
    const teacher = this.selectedTeacher();
    if (teacher) {
      this.teacherService.toggleFavorite(teacher.id);

      this.selectedTeacher.set({ ...teacher, isFavorite: !teacher.isFavorite });
    }
  }

  getInitials(): string {
    const teacher = this.selectedTeacher();
    if (teacher) {
      return this.teacherService.getInitials(teacher.firstName, teacher.lastName);
    }
    return '';
  }
}
