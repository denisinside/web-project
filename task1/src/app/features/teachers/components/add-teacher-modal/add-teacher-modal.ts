import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/teacher';
import { Teacher } from '../../../../models/teacher.model';
import _ from 'lodash';

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

    const validations = [
      {
        condition: _.isEmpty(_.trim(this.teacherData.full_name || '')),
        error: { field: 'full_name', message: 'Full name is required' }
      },
      {
        condition: this.teacherData.full_name && !this.teacherService.validateNameValue(this.teacherData.full_name),
        error: { field: 'full_name', message: 'Full name must start with capital letter' }
      },
      {
        condition: _.isEmpty(_.trim(this.teacherData.course || '')),
        error: { field: 'course', message: 'Course is required' }
      },
      {
        condition: _.isEmpty(_.trim(this.teacherData.country || '')),
        error: { field: 'country', message: 'Country is required' }
      },
      {
        condition: this.teacherData.country && !this.teacherService.validateNameValue(this.teacherData.country),
        error: { field: 'country', message: 'Country must start with capital letter' }
      },
      {
        condition: this.teacherData.city && !this.teacherService.validateNameValue(this.teacherData.city),
        error: { field: 'city', message: 'City must start with capital letter' }
      },
      {
        condition: !this.teacherData.age || !this.teacherService.validateAge(this.teacherData.age),
        error: { field: 'age', message: 'Age must be between 1 and 150' }
      },
      {
        condition: _.isEmpty(_.trim(this.teacherData.email || '')),
        error: { field: 'email', message: 'Email is required' }
      },
      {
        condition: this.teacherData.email && !this.teacherService.validateEmail(this.teacherData.email),
        error: { field: 'email', message: 'Invalid email format' }
      },
      {
        condition: _.isEmpty(_.trim(this.teacherData.phone || '')),
        error: { field: 'phone', message: 'Phone is required' }
      },
      {
        condition: !this.teacherData.gender || !this.teacherService.validateNameValue(this.teacherData.gender),
        error: { field: 'gender', message: 'Gender must be Male or Female' }
      },
      {
        condition: this.teacherData.note && !this.teacherService.validateNameValue(this.teacherData.note),
        error: { field: 'note', message: 'Note must start with capital letter' }
      }
    ];

    if (this.teacherData.phone && !_.isEmpty(_.trim(this.teacherData.phone || ''))) {
      this.teacherData.phone = this.teacherService.formatPhone(this.teacherData.phone);
      if (!this.teacherService.validatePhone(this.teacherData.phone)) {
        errors.push({ field: 'phone', message: 'Invalid phone format' });
      }
    }

    _.forEach(validations, ({ condition, error }) => {
      if (condition) {
        errors.push(error);
      }
    });
    
    return _.uniqBy(errors, 'field');
  }

  getFieldError(fieldName: string): string | null {
    const error = _.find(this.validationErrors(), { field: fieldName });
    return error?.message || null;
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
