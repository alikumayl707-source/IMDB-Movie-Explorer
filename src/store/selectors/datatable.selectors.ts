import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DataTableState } from "../../utils/model/datatable.state";
import {orderBy} from 'lodash';

export const selectDataTableState = createFeatureSelector<DataTableState<any>>('datatable');
export const selectData = createSelector(selectDataTableState,(state)=>{  state.data});
export const selectCurrentPage = createSelector(selectDataTableState,(state)=>state.currentPage);
export const selectSearchTerm=  createSelector(selectDataTableState,(state)=>state.searchTerm);
export const selectSortColumn=  createSelector(selectDataTableState,(state)=>state.sortColumn);
export const selectSortDirection=  createSelector(selectDataTableState,(state)=>state.sortDirection || 'asc');
export const selectPageSize = createSelector(selectDataTableState,(state)=>state.pageSize);
export const selectTotal = createSelector(selectDataTableState,(state)=> state.total)
export const selectTotalPages = createSelector(selectDataTableState, (state)=>Math.ceil(state.total / state.pageSize) || 1);

const normalizeFilter = (value:string)=>value.trim().toLowerCase() || ''

export const selectFilteredData = createSelector(
    selectDataTableState,   
    selectSearchTerm,
    (state, searchTerm)=>{
   
    let filteredData = [...state.data]
    const serachLower : string = normalizeFilter(searchTerm);
    if(searchTerm){
        filteredData = filteredData.filter((item) => 
        state.columns?.some((column)=>
            normalizeFilter(String(item[column.key])).includes(serachLower)));
    }
    if (Object.keys(state.columnFilters).length) {
     const filterKeys = Object.keys(state.columnFilters).filter(key => state.columnFilters[key]?.trim());
     filteredData = filteredData.filter(item =>
        filterKeys.every((keys)=>{
             return  normalizeFilter(String(item[keys])).includes(normalizeFilter(String(state.columnFilters[keys])))
        })
    );

    }
    
     if(state.sortColumn){
        
     filteredData = orderBy(filteredData, [state.sortColumn], [state.sortDirection] )
    }
    return filteredData.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
}

);
