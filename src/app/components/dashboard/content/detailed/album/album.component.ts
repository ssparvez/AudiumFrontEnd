import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  
  private id;
  album: Album;
  constructor(
    private route: ActivatedRoute,
	private router: Router,
    private libraryService : LibraryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.libraryService.getAlbum(this.id).subscribe((album) => {
        this.album = album;
		this.libraryService.getAlbumSongs(this.id).subscribe((songs) => {
          this.album.songs = songs;
        });
      });
    });
  }
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