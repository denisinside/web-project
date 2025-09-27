import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/teacher';
import { Teacher } from '../../../../models/teacher.model';

interface ValidationError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-add-teacher-modal',
  imports: [FormsModule],
  templateUrl: './add-teacher-modal.html',
  styleUrl: './add-teacher-modal.css'
})
export class AddTeacherModal implements OnInit {
  isVisible = signal(false);
  validationErrors = signal<ValidationError[]>([]);
  
  teacherData: Omit<Teacher, 'id' | 'favorite'> = {
    gender: 'Male',
    title: 'Mr',
    full_name: '',
    city: '',
    state: '',
    country: '',
    postcode: null,
    coordinates: null,
    timezone: null,
    email: '',
    b_date: null,
    age: 25,
    phone: '',
    picture_large: '',
    picture_thumbnail: '',
    course: '',
    bg_color: null,
    note: null
  };

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {

    document.addEventListener('openAddTeacherModal', () => {
      this.openModal();
    });
  }

  openModal() {
    this.isVisible.set(true);
    this.validationErrors.set([]);
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
    
    const errors = this.validateTeacherData();
    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return;
    }
    
    const newTeacher: Omit<Teacher, 'id'> = {
      ...this.teacherData,
      favorite: false
    };
    
    this.teacherService.addTeacher(newTeacher);
    this.closeModal();
  }

  private validateTeacherData(): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.teacherData.full_name || this.teacherData.full_name.trim() === '') {
      errors.push({ field: 'full_name', message: 'Full name is required' });
    } else if (!this.teacherService.validateNameValue(this.teacherData.full_name)) {
      errors.push({ field: 'full_name', message: 'Full name must start with capital letter' });
    }
    
    if (!this.teacherData.course || this.teacherData.course.trim() === '') {
      errors.push({ field: 'course', message: 'Course is required' });
    }
    
    if (!this.teacherData.country || this.teacherData.country.trim() === '') {
      errors.push({ field: 'country', message: 'Country is required' });
    } else if (!this.teacherService.validateNameValue(this.teacherData.country)) {
      errors.push({ field: 'country', message: 'Country must start with capital letter' });
    }
    
    if (this.teacherData.city && !this.teacherService.validateNameValue(this.teacherData.city)) {
      errors.push({ field: 'city', message: 'City must start with capital letter' });
    }
    
    if (!this.teacherData.age || !this.teacherService.validateAge(this.teacherData.age)) {
      errors.push({ field: 'age', message: 'Age must be between 1 and 150' });
    }
    
    if (!this.teacherData.email || this.teacherData.email.trim() === '') {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.teacherService.validateEmail(this.teacherData.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    if (!this.teacherData.phone || this.teacherData.phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Phone is required' });
    } else {    
      this.teacherData.phone = this.teacherService.formatPhone(this.teacherData.phone);
      if (!this.teacherService.validatePhone(this.teacherData.phone)) {
        errors.push({ field: 'phone', message: 'Invalid phone format' });
      }
    }
    
    if (!this.teacherData.gender || !this.teacherService.validateNameValue(this.teacherData.gender)) {
      errors.push({ field: 'gender', message: 'Gender must be Male or Female' });
    }
    
    if (this.teacherData.note && !this.teacherService.validateNameValue(this.teacherData.note)) {
      errors.push({ field: 'note', message: 'Note must start with capital letter' });
    }
    
    return errors;
  }

  getFieldError(fieldName: string): string | null {
    const error = this.validationErrors().find(err => err.field === fieldName);
    return error ? error.message : null;
  }

  private resetForm() {
    this.teacherData = {
      gender: 'Male',
      title: 'Mr',
      full_name: '',
      city: '',
      state: '',
      country: '',
      postcode: null,
      coordinates: null,
      timezone: null,
      email: '',
      b_date: null,
      age: 25,
      phone: '',
      picture_large: '',
      picture_thumbnail: '',
      course: '',
      bg_color: null,
      note: null
    };
    this.validationErrors.set([]);
  }
}
