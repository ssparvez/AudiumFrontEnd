import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LibraryService } from '../../../../../services/library/library.service';

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
          this.libraryService.getArtistAlbums(this.id).subscribe((albums) => {
            this.artist.albums = albums;
          });
        });
      });
    });
  }

}

interface Artist {
  artistId: number,
  artistName: string,
  bio: string,
  albums: Album[],
  songs: Song[]
}

interface Album {
  albumId: number,
  albumTitle: string,
  releaseYear: string,
  artistId: number,
  artistName: string,
  songs: Song[]
}

interface Song {
  songId: number,
  title: string,
  artistId: number,
  artistName: string,
  albumId: number,
  albumTitle: string,
  duration: number,
  isExplicit: boolean,
  year: string,
  genreId: number,
  genreName: string,
  playCount: number
}
