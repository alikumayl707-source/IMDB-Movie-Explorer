import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import {
  setColumns,
} from '../../../store/actions/datatable.actions';
import { logger } from '../../utilities/logger';
import { DataTableNgrxService } from '../../utilities/datatable.service';
import { DataTableState } from '../../model/datatable.state';
import { Router } from '@angular/router';

//  interface ColumnDef {
//   key: string;
//   header: string;
// }

@Component({
  selector: 'app-data-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app-data-table.component.html',
  styleUrl: './app-data-table.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataTableComponent<T> implements OnInit, OnDestroy {



  //Encapsulate Definition of the columns array
  private _columns: Array<{ key: keyof T; label: string; sortable?: boolean }> = [];


  //Encapsulate the columnVisibilty that contains key of property and it's visibility state
  _columnVisibility!: Record<keyof T, boolean>;

  //declare formArray object named as columnfilters
  columnFilters!: FormArray;

  //declare formControl object named as searchInput
  @Input()
  searchInput: FormControl = new FormControl();

  //Input setter property will set the columns definition into the table by taking from the parent component
  @Input() set columns(
    value: Array<{ key: keyof T; label: string; sortable?: boolean }>
  ) {
    //Validate the definition of columns is it correctly defined and making sure there is no undefined property thats come from the parent component
    if (Array.isArray(value) && value.every((col) => col?.key && col?.label)) {
      //update the setter values that comes from parent component into the ngrx action
      this.store.dispatch(
        setColumns({
          columns: value.map((col) => ({
            key: col.key as string,
            label: col.label,
            sortable: col.sortable,
          })),
        })
      );
      //Initialize the setter values array that comes from parent component into the encapsulated poperty of this class
      this._columns = [...value];
      //Initializes key value pair object set as marked 'true' to its properties by iterating values array that comes from the parent component into the encapsulated poperty named _columnVisibility of this class
      this._columnVisibility = Object.fromEntries(
        value.map((col) => [col.key as T, true])
      );
      setTimeout(() => {
        this.initializeColumnFilters();
      }, 0);
    } else {
      //Incase the some properties shall undefined
      logger('Invalid input columns provided');
    }
  }

  //This getter property will be bind to the template
  get columnVisibilty(): Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
  }> {
    //This will filter the columns of array based on _columnVisibility object property that marked as true only
    return this.columns.filter((col) => this._columnVisibility[col.key]);
  }
  //This getter property will be bind to the template
  get columns(): Array<{ key: keyof T; label: string; sortable?: boolean }> {
    //This will return the encapsulated _columns array that was come from the parent component
    return this._columns;
  }


  //Declaring the objects of an observables
  combinedData$: Observable<any> = new Observable<any>();
  currentPage$: Observable<number> = new Observable<number>();

  totalPages$: Observable<number> = new Observable<number>();
  pages$: Observable<number[]> = new Observable<number[]>();

  sortColumn$: Observable<any> = new Observable<any>();
  sortDirection$!: Observable<'asc' | 'desc'>;

  // searchObs$ = new Subject<string>();
  destroy$ = new Subject<void>();

  expandedItems = new Set<number | string>();
  //viewModels$! : Observable<DatatableViewModel<T>>
  constructor(
    private dataTableNgrxService: DataTableNgrxService<T>,
    private store: Store<DataTableState<T>>,
    private router: Router
  ) { }
  ngOnInit(): void {

    // Initializing observables with the ngrx selectors through fascade pattern
    this.combinedData$ = this.dataTableNgrxService.combinedData$.pipe(
      takeUntil(this.destroy$)
    );
    this.currentPage$ = this.dataTableNgrxService.currentPage$.pipe(
      takeUntil(this.destroy$)
    );
    this.totalPages$ = this.dataTableNgrxService.totalPages$.pipe(
      takeUntil(this.destroy$)
    );
    this.sortColumn$ = this.dataTableNgrxService.sortColumn$.pipe(
      takeUntil(this.destroy$)
    );
    this.sortDirection$ = this.dataTableNgrxService.sortDirection$.pipe(
      takeUntil(this.destroy$)
    );

    this.pages$ = this.totalPages$.pipe(
      map((totalPages) => Array.from({ length: totalPages }, (_, i) => i + 1)),
      takeUntil(this.destroy$)
    );

    // Subscribe formControl values changes obserbvale and update the reducer
    // through dispatching the ngrx action by the latest emission via some delay
    this.searchInput.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.dataTableNgrxService.updateDatatableParameter({ search: value })
      })
  }
  getFormControl(index: number): FormControl {
    //Creating form controls inside columnfilters form array till the lenght of the columns which passed by parent component
    return this.columnFilters?.controls[index] as FormControl;
  }
  viewDetail(id: string) {
    this.router.navigate([`movies/${id}`]);
  }
  toggleVisibility(columnKey: keyof T) {
    //this will behave like a toggle where the property which have bit true. this will make it false
    this._columnVisibility[columnKey] = !this._columnVisibility[columnKey];
    const allHidden = Object.values(this._columnVisibility).every((visibility) => !visibility)
    if (allHidden) {
      for (const key in this._columnVisibility) {
        this._columnVisibility[key as keyof T] = true;
      }
    }
  }
  initializeColumnFilters() {
    //Initialize formArray object with the form controls by the columns and its definition
    this.columnFilters = new FormArray(
      this.columns.map(() => new FormControl(''))
    );
    //Subscribe formArray valueChanges observable with the columns and its definition
    // for updating the column wise filter.
    this.columnFilters.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updateFilters());
  }

  updateFilters() {
    //This columnfilters.value reduce function will accumulate columns.key that were passed by the parent component
    //initialized with value that were emitted by formArray object that is columnfilters and return
    //as key value pair object and stored it to filters.
    const filters = this.columnFilters.value.reduce(
      (acc: Record<string, string>, value: string, index: number) => {
        if (value) acc[String(this.columns[index].key)] = value;
        return acc;
      },
      {} as Record<string, string>
    );
    //this will update the ngrx action with that key value pair object
    this.dataTableNgrxService.updateDatatableParameter({ filters })
  }
  changePage(page: number): void {
    if (page >= 1) {
      this.dataTableNgrxService.updateDatatableParameter({ page });
    }
  }
  toggleSort(column: keyof T): void {
    this.dataTableNgrxService.updateDatatableParameter({ sortColumn: column as string, sortDirection: 'asc' });
  }
  trackByFn(
    index: number,
    item: T & { id?: number | string }
  ): number | string {
    return item?.id ?? index;
  }

  previousPage(currentPage: number) {
    if (currentPage > 1) {
      this.changePage(currentPage - 1);
    }
  }
  nextPage(currentPage: number, totalPages: number) {
    if (currentPage < totalPages) {
      this.changePage(currentPage + 1);
    }
  }
  resetFilters() {
    this.columnFilters.reset();
    this.columnFilters.updateValueAndValidity();
    this.updateFilters();
  }
  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAY1BMVEXw8fP6+/2Ai5H19vjh5uro6epwfYLp6/FueYKdpKp1fIJtfoDz8/Ocpaju7u/w7/J4hIl9ho7t8OvR1Nf19fuxub93gYnc4eKUnKPAx8uHk5akqayyurvLztG5wMWToaOJkprRroSxAAADL0lEQVR4nO3dbXeaMACG4SwBNJ3kZSrQ6mr//69sYnUFASeHuT6xz91vhbZcTQhgPafixwMlvvoA/mXEoEYMasSgRgxqxKBGDGrEoPY9MAq4qRglgBvTEPPVEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYPanTE2n5VVv0AwRpi1LJZzkutJv7y7joyRXs9KSguDyQo9ZfdeVj9lU/a/L+annrVgKCxMuZl2+N1WYJjVtMPvZIn5Yowxw59PFDOsSRMj8jof+HyKmFVdVstC170N6WGssK6QUlZN77jTwxi1jRYpl88PgNm8HC3SleHONHGMaGO6JYhRO+cjpthfbkkPE9blwsWBkb3lLD1MWJrDI1xY0Na9DSliwh3A79f1wFUzRUw475UaelRIESM+luT+/Rk4xlqTrW5+wQUcI8T+cPvhQWOsWOwLV2Zq5PnlMmSMFWbrQ7oePZGM6OCBMcLsvQwfvqzHvssma2+CxVhrxVYe71uk19nwy64qa8ImfIywZn+yxLHJB2eaefFVS4OKCaf83slTXjptL68r1m4W0rmw6Y8GFBPn2FK2qhrbvd5Yq7I3//EocAaAYsK4VL6N8dXhcue6Oe0RZhouJgzL5vRo3Mo1+edMC+NSN5/DVi4UMOZ16S8x4VTPV+ZsEbVu7eF0rkAxq8Xnud/WxHuBD0uYY2Vnl0rHsYHDxHuYbW9Y5Pl6E1eBOMf0BdftAhQPc7yHGcFETRyAuuztEVdog4UptArX/SvFi4rKDgPTMGqw/tgUMGNz7DzTcqXeBnfxYaZhYcrnsTl2OuJqlw1b4nmD9TfNcHdyjXI85Gp0U7VrsDCzcv6BMJIYYr4ZJn96IIz5+8p8Pfc25cfd+f1ma/lUzAnpLVphbPLFnOyNLxf+J8y03ftfPukb8D2aqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGD2lTMQ/3j9iQjBjViUCMGNWJQIwY1YlAjBjViUHsH7KVv4VCSSZUAAAAASUVORK5CYII=';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
