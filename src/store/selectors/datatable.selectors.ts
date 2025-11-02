import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DataTableState } from "../../utils/model/datatable.state";

export const selectDataTableState = createFeatureSelector<DataTableState<any>>('datatable');
export const selectData = createSelector(selectDataTableState,(state)=>{ return state.data});
export const selectCurrentPage = createSelector(selectDataTableState,(state)=>state.currentPage);
export const selectSortColumn=  createSelector(selectDataTableState,(state)=>state.sortColumn);
export const selectSortDirection=  createSelector(selectDataTableState,(state)=>state.sortDirection || 'asc');
export const selectTotal = createSelector(selectDataTableState,(state)=> state.total)
export const selectTotalPages = createSelector(selectDataTableState, (state)=>Math.ceil(state.total / state.pageSize) || 1);
export const selectAllDataParams = createSelector(selectDataTableState,(state)=>({
    page:state.currentPage,
    pageSize:state.pageSize,
    search:state.searchTerm,
    filters:state.filters,
    sortCoulmn:state.sortColumn,
    sortDirection:state.sortDirection || 'asc'
})
)

