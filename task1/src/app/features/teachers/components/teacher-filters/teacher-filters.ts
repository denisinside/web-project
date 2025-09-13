import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService, TeacherFilter } from '../../../../shared/services/teacher';

@Component({
  selector: 'app-teacher-filters',
  imports: [FormsModule],
  templateUrl: './teacher-filters.html',
  styleUrl: './teacher-filters.css'
})
export class TeacherFilters {
  filters;

  constructor(private teacherService: TeacherService) {
    this.filters = this.teacherService.filters;
  }

  onFilterChange(filterKey: keyof TeacherFilter, event: any) {
    let value: any;
    
    if (filterKey === 'withPhoto' || filterKey === 'onlyFavorites') {
      value = event.target ? event.target.checked : event;
    } else {
      value = event.target ? event.target.value : event;
    }
    
    this.teacherService.updateFilters({ [filterKey]: value });
  }
}
