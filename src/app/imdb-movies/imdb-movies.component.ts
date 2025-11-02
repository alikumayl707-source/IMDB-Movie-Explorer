import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppDataTableComponent } from '../../utils/shared/app-data-table/app-data-table.component';
import { DataTableNgrxService } from '../../utils/utilities/datatable.service';
import { OmdbService } from '../../service/omdb.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-imdb-movies',
  imports: [CommonModule, AppDataTableComponent, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './imdb-movies.component.html',
  styleUrl: './imdb-movies.component.css'
})
export class ImdbMoviesComponent<MovieDetail> implements OnInit {

  constructor(private imdbService: OmdbService<MovieDetail>,private datatable:DataTableNgrxService<MovieDetail>) { }
  isLoadingState = false;
  columns = [
    { key: 'imdbID', label: 'ID', sortable: true },
    { key: 'Title', label: 'Title', sortable: true },
    { key: 'Type', label: 'Type', sortable: true },
    { key: 'Year', label: 'Year', sortable: true },
    { key: 'Poster', label: 'Poster', sortable: true },
  ];
  ngOnInit(): void {
    this.imdbService.getLoadingState().subscribe((state)=>this.isLoadingState=state)
    this.datatable.updateDatatableParameter({
        page: 1,
        pageSize: 10,
        filters: {},
        search: 'guardians',
        sortColumn: '',
        sortDirection: 'asc',
      })
    
  }
}
