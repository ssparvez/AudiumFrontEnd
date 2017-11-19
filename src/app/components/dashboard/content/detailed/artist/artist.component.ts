import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryService } from '../../../../../services/library/library.service';
import { Artist } from '../../../../../classes/Artist';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private id;
  artist: Artist;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService : LibraryService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.libraryService.getArtist(this.id).subscribe((artist) => {
        this.artist = artist;
		    this.libraryService.getArtistSongs(this.id).subscribe((songs) => {
          this.artist.songs = songs;
          console.log(this.artist.songs);
          this.libraryService.getArtistAlbums(this.id).subscribe((albums) => {
            this.artist.albums = albums;
          });
        });
      });
    });
  }

}