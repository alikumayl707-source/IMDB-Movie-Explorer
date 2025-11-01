import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbMoviesComponent } from './imdb-movies.component';

describe('ImdbMoviesComponent', () => {
  let component: ImdbMoviesComponent;
  let fixture: ComponentFixture<ImdbMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImdbMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImdbMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
