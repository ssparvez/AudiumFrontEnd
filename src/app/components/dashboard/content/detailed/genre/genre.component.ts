import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { GeneralService } from '../../../../../services/general/general.service';
import { environment } from '../../../../../../environments/environment';
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
  private id: number;
  public genre: Genre;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
  ) { }


  ngOnInit() {
    this.mediaPath = environment.mediaURL;
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      this.generalService.get("/genres/" + this.id + "/browse").subscribe((genre) => {
        this.genre = genre;
      });
    });
  }

}
