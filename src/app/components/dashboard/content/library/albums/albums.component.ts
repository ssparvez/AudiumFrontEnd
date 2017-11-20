import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { Router } from "@angular/router";
import { Album } from '../../../../../classes/Album';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  albums: Album[]
  constructor(
    private router: Router,
    private libraryService : LibraryService
  ) { }

  ngOnInit() {
    this.libraryService.getAllAlbums().subscribe((albums) => {
      this.albums = albums;
      console.log(this.albums);
    });
  }
  updateUrl() {

  }

  viewAlbum(albumId : number) {
	console.log("album #" + albumId);
    this.router.navigate(['/dash/album/', albumId]);
  }
}