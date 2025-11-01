import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbMoviesDetailsComponent } from './imdb-movies-details.component';

describe('ImdbMoviesDetailsComponent', () => {
  let component: ImdbMoviesDetailsComponent;
  let fixture: ComponentFixture<ImdbMoviesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImdbMoviesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImdbMoviesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
