import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../services/authentication/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthenticationService, private router: Router) { }

  canActivate( route, state: RouterStateSnapshot) {
    if ( this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
      return false;
    }

  }

}
