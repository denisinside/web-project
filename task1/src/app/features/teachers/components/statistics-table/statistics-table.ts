import { Component, signal, computed } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';

type SortColumn = 'name' | 'specialty' | 'age' | 'gender' | 'country';

@Component({
  selector: 'app-statistics-table',
  imports: [],
  templateUrl: './statistics-table.html',
  styleUrl: './statistics-table.css'
})
export class StatisticsTable {
  sortColumn = signal<SortColumn | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  statisticsData;

  sortedData = computed(() => {
    const data = [...this.statisticsData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) return data;

    return data.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (column) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'specialty':
        case 'age':
        case 'gender':
        case 'country':
          aValue = a[column];
          bValue = b[column];
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
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
  }
}
