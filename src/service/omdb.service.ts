import { inject, Injectable } from "@angular/core";
import { HttpService } from "../utils/utilities/http.helpers";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { finalize, map } from "rxjs/operators"; 
import { MovieDetail } from "../utils/model/MovieDetail";

@Injectable({
    providedIn: 'root'
})
export class OmdbService<T> {
    private httpService = inject(HttpService);
    private baseUrl = 'https://www.omdbapi.com/';
    private apiKey = 'b6bde18e';
    private loading = new BehaviorSubject<boolean>(false);
    getMovies = (params: {
        page: number;
        pageSize?: number;
        search?: string;
        filters?: { Type: string, Year: string, Title: string, imdbID: string };
        sortColumn?: string;
        sortDirection?: 'asc' | 'desc';
    }): Observable<{ data: Array<T>; total: number }> => {
        this.loading.next(true);
        let httpParams = new HttpParams()
            .set('page', params.page)
            .set('apikey', this.apiKey)
            .set('s', params.search || 'guardians'); 

            if (params.sortColumn) {
            httpParams = httpParams
                .set('sortColumn', params.sortColumn)
                .set('sortDirection', params.sortDirection || 'asc');
        }
        
        if (params.filters?.Type) {
            httpParams = httpParams.set(`type`, params.filters?.Type);
        }

        if (params.filters?.imdbID) {
            httpParams = httpParams.set('i', params.filters.imdbID);
        }
        if (params.filters?.Year) {
            httpParams = httpParams.set('y', params.filters.Year);
        }

        if (params.filters?.Title) {
            httpParams = httpParams.set('t', params.filters.Title);
        }
        
        return this.httpService
            .request<{ Search?: Array<T>; totalResults?: string }, 'json'>(
                'GET',
                this.baseUrl,
                undefined,
                { httpParams, responseType: 'json' }
            )
            .pipe(
                finalize(() => this.loading.next(false)),
                map((response) => ({
                    data: response.Search ?? [],
                    total: Number(response.totalResults ?? 0),
                }))
            );
    };
    getMovieDetail = (imdbID: string): Observable<MovieDetail> => {
        const httpParams = new HttpParams()
            .set('id', imdbID)

        return this.httpService.request<MovieDetail, 'json'>('GET', `${this.baseUrl}?i=${imdbID}&&apikey=${this.apiKey}`, undefined, { httpParams, responseType: 'json' });
    }
    getLoadingState = () => {
        return this.loading.asObservable()
    }
}
