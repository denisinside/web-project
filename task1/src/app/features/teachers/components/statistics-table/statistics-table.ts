import { Component, signal, computed, effect, AfterViewInit, OnDestroy } from '@angular/core';
import { TeacherService } from '../../../../shared/services/teacher';
import _ from 'lodash';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

type SortColumn = 'full_name' | 'course' | 'age' | 'gender' | 'country';
type ViewMode = 'table' | 'charts';

@Component({
  selector: 'app-statistics-table',
  imports: [],
  templateUrl: './statistics-table.html',
  styleUrl: './statistics-table.css'
})
export class StatisticsTable implements AfterViewInit, OnDestroy {
  sortColumn = signal<SortColumn | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  itemsPerPage = 20;
  viewMode = signal<ViewMode>('table');
  
  statisticsData;

  private charts: Chart[] = [];
  private chartsInitialized = false;

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

    effect(() => {
      if (this.viewMode() === 'charts' && this.chartsInitialized) {
        setTimeout(() => this.initializeCharts(), 100);
      }
    });
  }

  ngAfterViewInit(): void {
    this.chartsInitialized = true;
    if (this.viewMode() === 'charts') {
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
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

  switchView(mode: ViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'charts') {
      setTimeout(() => this.initializeCharts(), 100);
    } else {
      this.destroyCharts();
    }
  }

  private initializeCharts(): void {
    this.destroyCharts();
    
    const data = this.statisticsData();
    
    this.createCountryChart(data);
    this.createCourseChart(data);
    this.createGenderChart(data);
    this.createAgeChart(data);
  }

  private createCountryChart(data: any[]): void {
    const countryCounts = _.countBy(data, 'country');
    const sortedCountries = _.chain(countryCounts)
      .toPairs()
      .orderBy([1], ['desc'])
      .take(10)
      .value();

    this.createPieChart('countryChart', 'Teachers by Country', 
      _.map(sortedCountries, 0), 
      _.map(sortedCountries, 1));
  }

  private createCourseChart(data: any[]): void {
    const courseCounts = _.countBy(data, 'course');
    const sortedCourses = _.chain(courseCounts)
      .toPairs()
      .orderBy([1], ['desc'])
      .take(10)
      .value();

    this.createPieChart('courseChart', 'Teachers by Course', 
      _.map(sortedCourses, 0), 
      _.map(sortedCourses, 1));
  }

  private createGenderChart(data: any[]): void {
    const genderCounts = _.countBy(data, 'gender');
    
    this.createPieChart('genderChart', 'Teachers by Gender', 
      _.keys(genderCounts), 
      _.values(genderCounts));
  }

  private createAgeChart(data: any[]): void {
    const ageGroups = _.groupBy(data, (teacher) => {
      const age = teacher.age;
      if (!age) return 'Unknown';
      if (age < 25) return '18-24';
      if (age < 35) return '25-34';
      if (age < 45) return '35-44';
      if (age < 55) return '45-54';
      return '55+';
    });

    const labels = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const counts = _.map(labels, label => (ageGroups[label] || []).length);

    this.createPieChart('ageChart', 'Teachers by Age Group', labels, counts);
  }

  private createPieChart(canvasId: string, title: string, labels: string[], data: number[]): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const colors = this.generateColors(labels.length);

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 10,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = _.sum(data);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    const chart = new Chart(canvas, config);
    this.charts.push(chart);
  }

  private generateColors(count: number): string[] {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40',
      '#FFCE56', '#36A2EB', '#9966FF', '#FF6384', '#4BC0C0'
    ];
    
    return _.take(baseColors, count);
  }

  private destroyCharts(): void {
    _.forEach(this.charts, chart => chart.destroy());
    this.charts = [];
  }
}
