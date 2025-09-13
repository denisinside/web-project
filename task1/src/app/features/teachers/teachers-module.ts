import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddTeacherModal } from './components/add-teacher-modal/add-teacher-modal';
import { FavoritesCarousel } from './components/favorites-carousel/favorites-carousel';
import { StatisticsTable } from './components/statistics-table/statistics-table';
import { TeacherCard } from './components/teacher-card/teacher-card';
import { TeacherFilters } from './components/teacher-filters/teacher-filters';
import { TeacherInfoModal } from './components/teacher-info-modal/teacher-info-modal';
import { TeacherList } from './components/teacher-list/teacher-list';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AddTeacherModal,
    FavoritesCarousel,
    StatisticsTable,
    TeacherCard,
    TeacherFilters,
    TeacherInfoModal,
    TeacherList
  ],
  exports: [
    AddTeacherModal,
    FavoritesCarousel,
    StatisticsTable,
    TeacherCard,
    TeacherFilters,
    TeacherInfoModal,
    TeacherList
  ]
})
export class TeachersModule { }
