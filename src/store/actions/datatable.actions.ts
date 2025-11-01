import { createAction, props } from "@ngrx/store";
export const setColumns = createAction('[DataTable] setColumns', props<{ columns: Array<{ key: string, label: string, sortable?: boolean }> }>());
export const setSearchTerm = createAction('[DataTable] searchTerm', props<{ searchTerm: string }>());
export const updateColumnFilters = createAction('[DataTable] columnFilters', props<{ columnFilters: Record<string, string> }>());
export const updateSort = createAction('[DataTable] updateSort', props<{ column: any, direction: 'asc' | 'desc' }>());
export const setCurrentPage = createAction('[DataTable] currentPage', props<{ currentPage: number }>());
export const setPageSize = createAction('[DataTable] pageSize', props<{ pageSize: number }>());
export const setTotalRecords = createAction('[DataTable] pageSize', props<{ total: number }>());



export const loadMovies = createAction(
    '[DataTable/API] Load Movies',
    props<{
        page: number;
        pageSize: number;
        search?: string;
        filters?: { Type: string, Year: string, Title: string, imdbID: string };
        sortColumn?: string;
        sortDirection?: 'asc' | 'desc';
    }>()
);

export const loadMoviesSuccess = createAction(
    '[DataTable/API] Load Movies Success',
    props<{ data: any[]; total: number }>()
);

export const loadMoviesFailure = createAction(
    '[DataTable/API] Load Movies Failure',
    props<{ error: any }>()
);