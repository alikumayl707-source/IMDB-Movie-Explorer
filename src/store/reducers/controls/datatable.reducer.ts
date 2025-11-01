import { createReducer, on } from "@ngrx/store";
import {  loadMovies,  loadMoviesFailure,  loadMoviesSuccess,  setColumns,  setCurrentPage, setPageSize, setSearchTerm, updateColumnFilters, updateSort} from "../../actions/datatable.actions";
import { DataTableState } from "../../../utils/model/datatable.state";

export const initialDataTableState : DataTableState<any> = {
    data:[],
    searchTerm:'',
    columns:[],
    columnFilters:{},
    sortColumn:'name',
    sortDirection:'asc',
    currentPage:1,
    pageSize:10,
    total:0,
    loading:false,
    error:null
}

export const dataTableReducer = createReducer(
    initialDataTableState,


    on(loadMovies, (state) => ({ ...state, loading: true, error: null })),

    on(loadMoviesSuccess, (state, { data, total }) => ({
      ...state,
      data,
      total,
      loading: false
    })),
  
    on(loadMoviesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(setSearchTerm,(state,{searchTerm}) => ({...state, searchTerm})),
    on(updateColumnFilters,(state,{columnFilters})=> ({...state, columnFilters})),
    on(updateSort, (state, { column, direction }) => {
        return {
            ...state,
            sortColumn: column,
            sortDirection: direction
        };
    }),
    on(setColumns, (state, { columns }) => ({
        ...state,
        columns
      })),
      
    on(setCurrentPage,(state,{currentPage})=> ({...state, currentPage})),   
    on(setPageSize,(state,{pageSize})=> ({...state, pageSize}))
);  

