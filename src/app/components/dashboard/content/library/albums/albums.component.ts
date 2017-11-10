import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  albums: number[]
  constructor(private libraryService : LibraryService) { }

  ngOnInit() {
    this.albums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
  }

}
