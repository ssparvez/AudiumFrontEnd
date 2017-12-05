import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { GeneralService } from '../../../../../services/general/general.service';
import { DataService } from '../../../../../services/data.service';
import { Song } from '../../../../../classes/Song';
import { Artist } from '../../../../../classes/Artist';
import { Genre } from '../../../../../classes/Genre';


@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

  public mediaPath: string;
  public genre: Genre;
  public songs: Song[];
  public artists: Artist[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private dataService: DataService
  ) { }


  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.genre.genreId = + param['id'];
      this.generalService.get("/genres/" + this.genre.genreId + "/songs").subscribe((songs) => {
        this.songs = songs;
        this.generalService.get("/genres/" + this.genre.genreId + "/artists").subscribe((artists) => {
          this.artists = artists;
        });
      });
    });
  }


}
