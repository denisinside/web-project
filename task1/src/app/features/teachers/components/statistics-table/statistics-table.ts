import { Component, signal, computed } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import _ from 'lodash';

type SortColumn = 'full_name' | 'course' | 'age' | 'gender' | 'country';

@Component({
  selector: 'app-statistics-table',
  imports: [],
  templateUrl: './statistics-table.html',
  styleUrl: './statistics-table.css'
})
export class StatisticsTable {
  sortColumn = signal<SortColumn | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  itemsPerPage = 20;
  
  statisticsData;

  sortedData = computed(() => {
    const data = [...this.statisticsData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) return data;

    if (column !== 'age') {
      return this.teacherService.sortUsers(data, column, direction);
    } else {
      return this.teacherService.sortUsers(data, 'b_date', direction);
    }
  });

  paginatedData = computed(() => {
    const sorted = this.sortedData();
    const page = this.currentPage();
    const startIndex = (page - 1) * this.itemsPerPage;
    return _.slice(sorted, startIndex, startIndex + this.itemsPerPage);
  });

  paginationInfo = computed(() => {
    const currentPage = this.currentPage();
    const totalItems = this.sortedData().length;
    const startItem = (currentPage - 1) * this.itemsPerPage + 1;
    const endItem = _.min([currentPage * this.itemsPerPage, totalItems])!;
    return `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
  });

  totalPages = computed(() => {
    const totalItems = this.sortedData().length;
    return Math.ceil(totalItems / this.itemsPerPage);
  });

  constructor(private teacherService: TeacherService) {
    this.statisticsData = this.teacherService.statisticsData;
  }

  sortBy(column: SortColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    const totalPages = this.totalPages();
    if (_.inRange(page, 1, totalPages + 1)) {
      this.currentPage.set(page);
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    
    const startPage = _.max([1, currentPage - 2])!;
    const endPage = _.min([totalPages, startPage + 4])!;
    
    return _.range(startPage, endPage + 1);
  }
}
