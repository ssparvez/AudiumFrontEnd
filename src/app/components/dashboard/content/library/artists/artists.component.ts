import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[]
  constructor(
    private router: Router,
    private libraryService: LibraryService
  ) {
    this.libraryService.getAllArtists().subscribe((artists) => {
      this.artists = artists;
      console.log(this.artists);
    });
   }

  ngOnInit() {
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
  year: string,
  artistId: number,
  artistName: string,
  songs: Song[]
}

interface Song {
  id: number,
  title: string,
  artistId: number,
  artistName: string,
  albumId: number,
  albumTitle: string,
  duration: number,
  isExplicit: boolean,
  trackNumber: number
}