import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-artist-sidenav',
  templateUrl: './artist-sidenav.component.html',
  styleUrls: ['./artist-sidenav.component.css']
})
export class ArtistSidenavComponent implements OnInit {
  public currentUser;
  isExpanded: boolean = false;
  logoImg: string = "assets/images/logo.png";
  mediaURL: string;

  constructor(
    private router: Router, 
    private authService: AuthenticationService, 
    private dataService: DataService) {
    //const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.mediaURL = this.dataService.mediaURL;
  }

  ngOnInit() {

  }

  // Closes the current active link
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
