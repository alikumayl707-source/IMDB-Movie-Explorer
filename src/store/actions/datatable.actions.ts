import { createAction, props } from "@ngrx/store";
export const setColumns = createAction('[DataTable] setColumns', props<{ columns: Array<{ key: string, label: string, sortable?: boolean }> }>());
export const updateColumnFilters = createAction('[DataTable] columnFilters', props<{ columnFilters: Record<string, string> }>());
export const setTotalRecords = createAction('[DataTable] totalReords', props<{ total: number }>());
export const updateTableParameters = createAction(
    '[DataTable] UpdateTableParameters',
     props<{ 
        page?: number;
        pageSize?: number;
        search?: string;
        filters?: Record<string, string>;
        sortColumn?: string;
        sortDirection?: 'asc' | 'desc'; 
    }>()
)
export const loadData = createAction(
    '[DataTable/API] Load Data',
    props<{
        page: number;
        pageSize: number;
        search?: string;
        filters?: Record<string,string>;
        sortColumn?: string;
        sortDirection?: 'asc' | 'desc';
    }>()
);

export const loadDataSuccess = createAction(
    '[DataTable/API] Load Data Success',
    props<{ data: any[]; total: number }>()
);

export const loadDataFailure = createAction(
    '[DataTable/API] Load Data Failure',
    props<{ error: any }>()
);