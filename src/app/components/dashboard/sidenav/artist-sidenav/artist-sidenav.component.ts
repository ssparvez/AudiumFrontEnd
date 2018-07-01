import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-artist-sidenav',
  templateUrl: './artist-sidenav.component.html',
  styleUrls: ['../sidenav.component.css']
})
export class ArtistSidenavComponent implements OnInit {
  public currentUser;
  isExpanded: boolean = false;
  logoImg: string = "assets/images/logo.png";
  mediaURL: string;

  constructor(
    private router: Router, 
    private authService: AuthenticationService) {
    //const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.mediaURL = environment.mediaURL;
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
