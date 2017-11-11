import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../../services/authentication/authentication.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  isExpanded = false;
  accountName : string;
  accountImage : string;

  constructor(private router: Router, private authService: AuthenticationService) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
    this.accountName = currentUser._firstName + " " + currentUser._lastName;
    this.accountImage = currentUser._profilePicUrl;
  }

  ngOnInit() {

  }
  // closes the current active link
  close() {
    this.router.navigate([{ outlets: { content: null }}]);
  }

  changeExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/true']);
  }

}


