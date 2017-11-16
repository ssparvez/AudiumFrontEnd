import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  things: number[];
  constructor() { }

  ngOnInit() {
    this.things = [1,2,3,4,5,6]
  }

}
