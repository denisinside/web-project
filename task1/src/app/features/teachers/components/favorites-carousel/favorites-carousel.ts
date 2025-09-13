import { Component, ElementRef, ViewChild } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import { Teacher } from '../../../../models/teacher.model';

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

  onTeacherSelected(teacher: Teacher) {
    const event = new CustomEvent('openTeacherInfoModal', { detail: teacher });
    document.dispatchEvent(event);
  }

  getInitials(firstName: string, lastName: string): string {
    return this.teacherService.getInitials(firstName, lastName);
  }
}
