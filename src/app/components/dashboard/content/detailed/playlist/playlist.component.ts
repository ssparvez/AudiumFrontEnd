import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Song } from '../../../../../classes/Song'
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})

export class PlaylistComponent implements OnInit {

  private id;
  playlist: Playlist

  constructor(
    private route: ActivatedRoute,
	  private router: Router,
    private generalService : GeneralService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.generalService.get("/playlists/" + this.id).subscribe((playlist) => {
        this.playlist = playlist;
		    this.generalService.get("/playlists/" + this.id + "/songs").subscribe((songs) => {
          this.playlist.songs = songs;
        });
      });
    });
  }

}

interface Playlist {
  playlistId: number,
  name: string,
  description: string,
  isPublic: boolean,
  accountId: number,
  username: string,
  songs: Song[]
}