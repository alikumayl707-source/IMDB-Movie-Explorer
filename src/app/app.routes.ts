import { Routes } from '@angular/router';
import { ImdbMoviesComponent } from './imdb-movies/imdb-movies.component';
import { ImdbMoviesDetailsComponent } from './imdb-movies-details/imdb-movies-details.component';

export const routes: Routes = [
    {path : 'movies' , component : ImdbMoviesComponent},
    {path : 'movies/:id' , component : ImdbMoviesDetailsComponent},
    {path : '**' , redirectTo : '/movies'}
    
];
