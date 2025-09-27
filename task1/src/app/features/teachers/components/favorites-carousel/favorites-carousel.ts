import { Component, ElementRef, ViewChild } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';

@Component({
  selector: 'app-favorites-carousel',
  imports: [],
  templateUrl: './favorites-carousel.html',
  styleUrl: './favorites-carousel.css'
})
export class FavoritesCarousel {
  @ViewChild('favoritesContainer') favoritesContainer!: ElementRef;
  favoriteTeachers;

  constructor(private teacherService: TeacherService) {
    this.favoriteTeachers = this.teacherService.favoriteTeachers;
  }

  scrollLeft() {
    if (this.favoritesContainer) {
      this.favoritesContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.favoritesContainer) {
      this.favoritesContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }

  onTeacherSelected(teacher: any) {
    this.teacherService.openTeacherModal(teacher);
  }

  getInitials(fullName: string): string {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    return this.teacherService.getInitials(firstName, lastName);
  }
}
