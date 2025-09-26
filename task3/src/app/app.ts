import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from './shared/services/teacher';
import { TeachersModule } from './features/teachers/teachers-module';

@Component({
  selector: 'app-root',
  imports: [FormsModule, TeachersModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('web-project');
  searchTerm = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.initializeTeachers();
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.teacherService.updateFilters({ search: this.searchTerm });
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openAddTeacherModal() {

    const event = new CustomEvent('openAddTeacherModal');
    document.dispatchEvent(event);
  }
}
