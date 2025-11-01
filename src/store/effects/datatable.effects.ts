// datatable.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { loadMovies, loadMoviesSuccess, loadMoviesFailure } from '../actions/datatable.actions';
import { HttpService } from '../../utils/utilities/http.helpers';
import { OmdbService } from '../../service/omdb.service';

@Injectable()
export class DataTableEffects {
  
 actions$ = inject(Actions);
  dataService = inject(OmdbService);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMovies),
      switchMap((params) =>
        this.dataService.getMovies(params).pipe(
          map((res) => loadMoviesSuccess({ data: res.data, total: res.total })),
          catchError((error) => of(loadMoviesFailure({ error })))
        )
      )
    )
  ) 

}
