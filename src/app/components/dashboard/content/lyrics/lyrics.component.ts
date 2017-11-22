import { Component, OnInit } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GeneralService } from '../../../../services/general/general.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {

  private id;
  song: Song;

  constructor(
    private route: ActivatedRoute,
	  private router: Router,
    private generalService : GeneralService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      // feel free to change if getting song is redundant
      this.generalService.get("/songs/" + this.id).subscribe((song) => {
        this.song = song;
		    // this.libraryService.getSongLyrics(this.id).subscribe((lyrics) => {
        //   this.song.lyrics = lyrics;
        // });
      });
    });
  }

}
