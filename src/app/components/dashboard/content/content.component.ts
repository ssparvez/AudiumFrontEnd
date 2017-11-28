import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  public currentUser: JSON;
  public currentAccountRole;

  constructor(private router: Router) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountRole = this.currentUser['_role'];
    console.log(this.currentAccountRole);
  }

  ngOnInit() {
  }

  onEnter(keywords: string) {
    this.router.navigate(['/dash/search/', keywords]);
    console.log(keywords);
  }
}
