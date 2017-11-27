import { Component, OnInit } from '@angular/core';
import {MzToastService} from "ng2-materialize";
import {MatDialog} from "@angular/material";
import {AccountsComponent} from "../../../../../modals/admin/accounts/accounts.component";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  public currentUser: JSON;
  public currentUsername;

  constructor() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentUsername = this.currentUser['_username'];
  }

  ngOnInit() {
  }


}
