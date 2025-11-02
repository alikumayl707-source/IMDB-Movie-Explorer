import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateTableParameters } from '../../store/actions/datatable.actions';
import { selectCurrentPage, selectData, selectSortColumn, selectSortDirection, selectTotalPages } from '../../store/selectors/datatable.selectors';
import { DataTableState } from '../model/datatable.state';
@Injectable({
  providedIn: 'root',
})
export class DataTableNgrxService<T> {
  combinedData$!: Observable<T[]>;
  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;
  sortColumn$!: Observable<any>;
  sortDirection$!: Observable<any>;
  
  constructor(private store: Store<{ datatable: DataTableState<T> }>) {
    this.combinedData$ = store.select(selectData) as Observable<T[]>;
    this.currentPage$ = store.select(selectCurrentPage);
    this.totalPages$ = store.select(selectTotalPages);
    this.sortColumn$ = store.select(selectSortColumn);
    this.sortDirection$ = store.select(selectSortDirection)
  }

  updateDatatableParameter(filters: {page?:number,pageSize?:number,filters?:Record<string,string>,search?:string,sortColumn?:string,sortDirection?:'asc' | 'desc'}): void {
    console.log(filters)
    this.store.dispatch(updateTableParameters(filters));
  }
 
}
