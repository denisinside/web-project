import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/teacher';
import { Teacher } from '../../../../models/teacher.model';

@Component({
  selector: 'app-add-teacher-modal',
  imports: [FormsModule],
  templateUrl: './add-teacher-modal.html',
  styleUrl: './add-teacher-modal.css'
})
export class AddTeacherModal implements OnInit {
  isVisible = signal(false);
  
  teacherData: Omit<Teacher, 'id' | 'isFavorite'> = {
    firstName: '',
    lastName: '',
    specialty: '',
    country: '',
    city: '',
    age: 25,
    gender: 'Male',
    email: '',
    phone: '',
    photoUrl: ''
  };

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {

    document.addEventListener('openAddTeacherModal', () => {
      this.openModal();
    });
  }

  openModal() {
    this.isVisible.set(true);
  }

  closeModal() {
    this.isVisible.set(false);
    this.resetForm();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    const newTeacher: Omit<Teacher, 'id'> = {
      ...this.teacherData,
      isFavorite: false
    };
    
    this.teacherService.addTeacher(newTeacher);
    this.closeModal();
  }

  private resetForm() {
    this.teacherData = {
      firstName: '',
      lastName: '',
      specialty: '',
      country: '',
      city: '',
      age: 25,
      gender: 'Male',
      email: '',
      phone: '',
      photoUrl: ''
    };
  }
}
