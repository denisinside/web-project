import { Component, effect, signal } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import dayjs from 'dayjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-teacher-info-modal',
  imports: [],
  templateUrl: './teacher-info-modal.html',
  styleUrl: './teacher-info-modal.css'
})
export class TeacherInfoModal {
  isVisible;
  selectedTeacher;
  isMapVisible = signal(false);
  private map: L.Map | null = null;

  constructor(private teacherService: TeacherService) {
    this.isVisible = this.teacherService.isModalVisible;
    this.selectedTeacher = this.teacherService.selectedTeacher;

    effect(() => {
      const teacher = this.selectedTeacher();
      if (teacher && this.isMapVisible() && teacher.coordinates) {
        setTimeout(() => this.initializeMap(), 100);
      }
    });
  }

  closeModal() {
    this.isMapVisible.set(false);
    this.destroyMap();
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

  getDaysUntilBirthday(): number | null {
    const teacher = this.selectedTeacher();
    if (!teacher || !teacher.b_date) {
      return null;
    }

    const today = dayjs();
    const birthDate = dayjs(teacher.b_date);
    
    let nextBirthday = birthDate.year(today.year());
    
    if (nextBirthday.isBefore(today, 'day') || nextBirthday.isSame(today, 'day')) {
      nextBirthday = nextBirthday.add(1, 'year');
    }
    
    return nextBirthday.diff(today, 'day');
  }

  toggleMap(event: Event) {
    event.preventDefault();
    const newVisibility = !this.isMapVisible();
    this.isMapVisible.set(newVisibility);

    if (newVisibility) {
      setTimeout(() => this.initializeMap(), 100);
    } else {
      this.destroyMap();
    }
  }

  hasCoordinates(): boolean {
    const teacher = this.selectedTeacher();
    return !!(teacher?.coordinates?.latitude && teacher?.coordinates?.longitude);
  }

  private initializeMap(): void {
    const teacher = this.selectedTeacher();
    if (!teacher?.coordinates?.latitude || !teacher?.coordinates?.longitude) {
      return;
    }

    this.destroyMap();

    const mapContainer = document.getElementById('teacher-map');
    if (!mapContainer) {
      return;
    }

    const lat = parseFloat(teacher.coordinates.latitude);
    const lng = parseFloat(teacher.coordinates.longitude);

    this.map = L.map('teacher-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`<b>${teacher.full_name}</b><br>${teacher.city}, ${teacher.country}`)
      .openPopup();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
