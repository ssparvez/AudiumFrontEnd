import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-playlist-dropdown',
  templateUrl: './playlist-dropdown.component.html',
  styleUrls: ['./playlist-dropdown.component.css']
})
export class PlaylistDropdownComponent implements OnInit {

  @Input() dropdownId: string;
  isPulbic = true;

  constructor() { }

  ngOnInit() {
  }

}
