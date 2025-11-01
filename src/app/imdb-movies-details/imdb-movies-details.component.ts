import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OmdbService } from '../../service/omdb.service';
import { MovieDetail } from '../../utils/model/MovieDetail';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-imdb-movies-details',
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './imdb-movies-details.component.html',
  styleUrl: './imdb-movies-details.component.css'
})
export class ImdbMoviesDetailsComponent<T> implements OnInit {

  constructor(private imdb: OmdbService<T>, private router: ActivatedRoute) { }
  movie!: MovieDetail;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;

    const { id } = this.router.snapshot.params;

    this.imdb.getMovieDetail(id).pipe(finalize(() => this.isLoading = false)).subscribe((response) => {
      this.movie = response;
    })

  }
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAY1BMVEXw8fP6+/2Ai5H19vjh5uro6epwfYLp6/FueYKdpKp1fIJtfoDz8/Ocpaju7u/w7/J4hIl9ho7t8OvR1Nf19fuxub93gYnc4eKUnKPAx8uHk5akqayyurvLztG5wMWToaOJkprRroSxAAADL0lEQVR4nO3dbXeaMACG4SwBNJ3kZSrQ6mr//69sYnUFASeHuT6xz91vhbZcTQhgPafixwMlvvoA/mXEoEYMasSgRgxqxKBGDGrEoPY9MAq4qRglgBvTEPPVEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYPanTE2n5VVv0AwRpi1LJZzkutJv7y7joyRXs9KSguDyQo9ZfdeVj9lU/a/L+annrVgKCxMuZl2+N1WYJjVtMPvZIn5Yowxw59PFDOsSRMj8jof+HyKmFVdVstC170N6WGssK6QUlZN77jTwxi1jRYpl88PgNm8HC3SleHONHGMaGO6JYhRO+cjpthfbkkPE9blwsWBkb3lLD1MWJrDI1xY0Na9DSliwh3A79f1wFUzRUw475UaelRIESM+luT+/Rk4xlqTrW5+wQUcI8T+cPvhQWOsWOwLV2Zq5PnlMmSMFWbrQ7oePZGM6OCBMcLsvQwfvqzHvssma2+CxVhrxVYe71uk19nwy64qa8ImfIywZn+yxLHJB2eaefFVS4OKCaf83slTXjptL68r1m4W0rmw6Y8GFBPn2FK2qhrbvd5Yq7I3//EocAaAYsK4VL6N8dXhcue6Oe0RZhouJgzL5vRo3Mo1+edMC+NSN5/DVi4UMOZ16S8x4VTPV+ZsEbVu7eF0rkAxq8Xnud/WxHuBD0uYY2Vnl0rHsYHDxHuYbW9Y5Pl6E1eBOMf0BdftAhQPc7yHGcFETRyAuuztEVdog4UptArX/SvFi4rKDgPTMGqw/tgUMGNz7DzTcqXeBnfxYaZhYcrnsTl2OuJqlw1b4nmD9TfNcHdyjXI85Gp0U7VrsDCzcv6BMJIYYr4ZJn96IIz5+8p8Pfc25cfd+f1ma/lUzAnpLVphbPLFnOyNLxf+J8y03ftfPukb8D2aqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGDGjGoEYMaMagRgxoxqBGD2lTMQ/3j9iQjBjViUCMGNWJQIwY1YlAjBjViUHsH7KVv4VCSSZUAAAAASUVORK5CYII=';
  }

}
