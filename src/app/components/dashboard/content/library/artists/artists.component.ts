import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[]
  constructor(private libraryService: LibraryService) {
    this.libraryService.getAllArtists().subscribe((artists) => {
      this.artists = artists;
      console.log(this.artists);
    });
   }

  ngOnInit() {
  }

}

interface Artist {
  name: string;
}