import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent,{providers: [
 ...appConfig.providers,
  provideAnimations(),
  importProvidersFrom(
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    })
  )
]
})
  .catch((err) => console.error(err));
