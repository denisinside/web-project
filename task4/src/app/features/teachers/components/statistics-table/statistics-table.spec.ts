import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsTable } from './statistics-table';

describe('StatisticsTable', () => {
  let component: StatisticsTable;
  let fixture: ComponentFixture<StatisticsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
