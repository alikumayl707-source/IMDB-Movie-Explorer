import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { dataTableReducer } from '../store/reducers/controls/datatable.reducer';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { DataTableEffects } from '../store/effects/datatable.effects';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideServerRouting } from '@angular/ssr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideServerRouting([]),                  
    provideRouter(routes),
    provideStore({datatable:dataTableReducer}),
    provideEffects([DataTableEffects]),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatProgressSpinnerModule)
  ]
};
