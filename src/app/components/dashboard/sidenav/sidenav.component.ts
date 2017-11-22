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
  accountName: string;
  accountImage: string;
  logoImg: string = "assets/images/logo.png";

  constructor(private router: Router, private authService: AuthenticationService) {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
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

  onMouseOverLogo() {
    this.logoImg = "assets/images/logo_grey.png";
  }

  onMouseOutLogo() {
    this.logoImg = "assets/images/logo.png";
  }

}


