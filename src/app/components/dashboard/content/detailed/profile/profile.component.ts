import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  followers: number[];
  constructor() { }

  ngOnInit() {
    this.followers = [1,2,3,4]
  }

}
