import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, take } from 'rxjs';
import {  setSearchTerm, updateSort, setPageSize, setTotalRecords, loadMovies } from '../../store/actions/datatable.actions';
import { selectFilteredData, selectCurrentPage, selectTotalPages, selectSortColumn, selectSortDirection } from '../../store/selectors/datatable.selectors';
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
    this.combinedData$ = store.select(selectFilteredData);
    this.currentPage$ = store.select(selectCurrentPage);
    this.totalPages$ = store.select(selectTotalPages);
    this.sortColumn$ = store.select(selectSortColumn);
    this.sortDirection$ = store.select(selectSortDirection);
  }

  uploadData(filters: {page:number,pageSize:number,filters:{Type:'',Year:'',imdbID:'',Title:''},search:string,sortColumn:string,sortDirection:'asc'}): void {
    this.store.dispatch(loadMovies(filters));
  }
  updateSearchTerm(search: string): void {
    this.store.dispatch(setSearchTerm({ searchTerm: search }));
  }
  updateColumnFilter(columnFilters: {page:number,pageSize:number,filters:{Type:'',Year:'',imdbID:'',Title:''},search:string,sortColumn:string,sortDirection:'asc'}): void {
    this.store.dispatch(loadMovies( columnFilters ));
  }

  updateSortColumn(column: keyof T): void {
    combineLatest([
      this.store.select(selectSortColumn),
      this.store.select(selectSortDirection),
    ])
      .pipe(take(1))
      .subscribe(([currentSortColumn, currentSortDirection]) => {
        const newDirection =
          currentSortColumn === column
            ? currentSortDirection === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.store.dispatch(updateSort({ column, direction: newDirection }));
      });
  }
  setCurrentPage(page: number): void {
    this.store.dispatch(loadMovies({ page , pageSize:10 , search:'guardians'}));
  }
  setPageSize(value: number): void {
    this.store.dispatch(setPageSize({ pageSize: value }));
  }

  setTotalRecords(total:number):void{
    this.store.dispatch(setTotalRecords({total}));
  }
}
