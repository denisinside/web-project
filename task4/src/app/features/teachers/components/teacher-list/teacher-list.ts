import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../../shared/services/teacher';
import { TeacherCard } from '../teacher-card/teacher-card';

@Component({
  selector: 'app-teacher-list',
  imports: [TeacherCard, CommonModule],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css'
})
export class TeacherList {
  paginatedTeachers;
  currentPage;
  totalPages;
  isLoading;

  constructor(private teacherService: TeacherService) {
    this.paginatedTeachers = this.teacherService.paginatedTeachers;
    this.currentPage = this.teacherService.currentPage;
    this.totalPages = this.teacherService.totalPages;
    this.isLoading = this.teacherService.isLoading;
  }

  onPrevious() {
    this.teacherService.previousPage();
  }

  onNext() {
    this.teacherService.nextPage();
  }

  onGoToPage(page: number) {
    this.teacherService.goToPage(page);
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 1) return [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    if (current > 3) {
      pages.push('...');
    }
    if (current > 2) {
      pages.push(current - 1);
    }
    if (current !== 1 && current !== total) {
      pages.push(current);
    }
    if (current < total - 1) {
      pages.push(current + 1);
    }
    if (current < total - 2) {
      pages.push('...');
    }
    pages.push(total);
    
    return [...new Set(pages)];
  }
}
