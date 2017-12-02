import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {

  public currentUser: JSON;
  public currentAccountRole;

  constructor() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountRole = this.currentUser['_role'];
    console.log(this.currentAccountRole);
  }

  ngOnInit() {
  }

}
