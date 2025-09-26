import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesCarousel } from './favorites-carousel';

describe('FavoritesCarousel', () => {
  let component: FavoritesCarousel;
  let fixture: ComponentFixture<FavoritesCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
