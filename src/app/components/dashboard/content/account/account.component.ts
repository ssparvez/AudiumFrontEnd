import { Component, OnInit } from '@angular/core';
import {CustomerAccount} from "../../../../classes/customer-account.service";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor( private currentUser: CustomerAccount, private dataService:DataService) { }

  ngOnInit() {
    if ( this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
      this.currentUser.profilePicURL = this.dataService.profilePic + this.currentUser.accountId + '.png';
    }
  }


  getCurrentUser() {

    return this.currentUser;
  }

}


