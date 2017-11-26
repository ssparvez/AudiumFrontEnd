import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent implements OnInit {
  public  logoImg = "assets/images/logo.png";

  constructor(private router: Router,
              private authService: AuthenticationService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/true']);
  }
  close() {
    this.router.navigate([{ outlets: { content: null }}]);
  }
  onMouseOverLogo() {
    this.logoImg = "assets/images/logo_grey.png";
  }

  onMouseOutLogo() {
    this.logoImg = "assets/images/logo.png";
  }
}
