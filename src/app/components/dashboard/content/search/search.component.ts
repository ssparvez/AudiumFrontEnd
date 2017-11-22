import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { Artist } from '../../../../classes/Artist';
import { Album } from '../../../../classes/Album';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { GeneralService } from '../../../../services/general/general.service';
import { AppError } from '../../../../errors/AppError';
import { Playlist } from '../../../../classes/Playlist';
import { CustomerAccount } from '../../../../classes/CustomerAccount';
import { PlayerService } from '../../../../services/player/player.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  keywords: string;
  songs : Song[];
  artists : Artist[];
  albums : Album[];
  playlists : Playlist[];
  profiles : CustomerAccount[];
  mediaPath: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.keywords = param['keywords'];
      console.log(this.keywords);
      this.generalService.get("/search/songs/" + this.keywords).subscribe((songs) => {
        this.songs = songs;
        console.log(this.songs);
        this.generalService.get("/search/artists/" + this.keywords).subscribe((artists) => {
          this.artists = artists;
          console.log(this.artists);
          this.generalService.get("/search/albums/" + this.keywords).subscribe((albums) => {
            this.albums = albums;
            console.log(this.albums);
            this.generalService.get("/search/playlists/" + this.keywords).subscribe((playlists) => {
              this.playlists = playlists;
              console.log(this.playlists);
              this.generalService.get("/search/profiles/" + this.keywords).subscribe((profiles) => {
                this.profiles = profiles;
                console.log(this.profiles);
              });
            });
          });
        });

      });


    });
  }

  playSongs(index: number): void {
    this.playerService.playSongs(index, this.songs);
  }

  playArtistSongs(artistId: number): void {
    this.generalService.get("/artists/" + artistId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }

  playAlbumSongs(albumId: number): void {
    this.generalService.get("/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }

  playPlaylistSongs(playlistId: number): void {
    this.generalService.get("/playlist/" + playlistId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }

}
