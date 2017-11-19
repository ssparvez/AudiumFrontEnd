import { Component, OnInit } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from '../../../../services/library/library.service';

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
    private libraryService : LibraryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      // feel free to change if getting song is redundant
      this.libraryService.getSong(this.id).subscribe((song) => {
        this.song = song;
		    // this.libraryService.getSongLyrics(this.id).subscribe((lyrics) => {
        //   this.song.lyrics = lyrics;
        // });
      });
    });
  }

}
