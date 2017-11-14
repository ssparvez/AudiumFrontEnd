import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  albums: Album[]
  constructor(private libraryService : LibraryService) { }

  ngOnInit() {
    this.libraryService.getAllAlbums().subscribe((albums) => {
      this.albums = albums;
      console.log(this.albums);
    });
  }
  updateUrl() {
    
  }
}

interface Album {
  title: string;
  artist: Artist;
}

interface Artist {
  name: string;
}
