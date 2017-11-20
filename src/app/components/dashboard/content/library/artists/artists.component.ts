import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { Router } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';

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
  ) {}

  ngOnInit() {
    this.libraryService.getAllArtists().subscribe((artists) => {
      if(artists != null){
        this.artists = artists;
      }
    });
  }
}