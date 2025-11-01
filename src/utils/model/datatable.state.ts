export interface DataTableState<T>{
    data:T[];
    searchTerm:string;
    columns:Array<{key:keyof T,label:string,sortable?:boolean}>;
    columnFilters:{[key in keyof T]?:string};
    sortColumn:keyof T;
    sortDirection:'asc'|'desc';
    currentPage:number;
    pageSize:number;
    total:number;
    loading:boolean;
    error:null;
}