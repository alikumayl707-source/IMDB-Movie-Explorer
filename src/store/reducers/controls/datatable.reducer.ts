import { createReducer, on } from "@ngrx/store";
import {  loadData, loadDataFailure, loadDataSuccess, setColumns, updateTableParameters} from "../../actions/datatable.actions";
import { DataTableState } from "../../../utils/model/datatable.state";

export const initialDataTableState : DataTableState<any> = {
    data:[],
    searchTerm:'',
    columns:[],
    filters:{},
    sortColumn:'Title',
    sortDirection:'asc',
    currentPage:1,
    pageSize:10,
    total:0,
    loading:false,
    error:null
}

export const dataTableReducer = createReducer(
    initialDataTableState,
    on(loadData, (state) => ({ ...state, loading: true, error: null })),
    on(loadDataSuccess, (state, { data, total }) => ({
      ...state,
      data,
      total,
      loading: false
    })),
    on(loadDataFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(updateTableParameters,(state,action)=>(
      {
      ...state,
      currentPage:action.page ?? state.currentPage,
      pageSize:action.pageSize ?? state.pageSize,
      searchTerm:action.search ?? state.searchTerm,
      filters:action.filters ?? state.filters,
      sortColumn : action.sortColumn ?? state.sortColumn,
      sortDirection : action.sortDirection ?? state.sortDirection
    })
  ),
    on(setColumns, (state, { columns }) => ({
        ...state,
        columns
      })),
      
);  

