import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  isExpanded = false;

  constructor(private router: Router) { }

  ngOnInit() {

  }
  // closes the current active link
  close() {
    this.router.navigate([{ outlets: { content: null }}]);
  }

  changeExpansion() {
    this.isExpanded = !this.isExpanded;
  }

}


