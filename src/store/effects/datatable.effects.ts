// datatable.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, of, switchMap, withLatestFrom } from 'rxjs';
import { loadData, loadDataFailure, loadDataSuccess, updateTableParameters } from '../actions/datatable.actions';
import { OmdbService } from '../../service/omdb.service';
import { select, Store } from '@ngrx/store';
import { selectAllDataParams } from '../selectors/datatable.selectors';

@Injectable()
export class DataTableEffects {
  
  actions$ = inject(Actions);
  store$ = inject(Store)
  dataService = inject(OmdbService);

  loadDataOnParamChanges$ = createEffect(() =>
    this.actions$.pipe(
    ofType(updateTableParameters),
     debounceTime(800),
     withLatestFrom(this.store$.pipe(select(selectAllDataParams))),
      switchMap(([action, params]) =>
      {
       return this.dataService.getMovies(params).pipe(
          map((res) => loadDataSuccess({ data: res.data, total: res.total })),
          catchError((error) => of(loadDataFailure({ error })))
        )
      }
      )
    )
  )

}
