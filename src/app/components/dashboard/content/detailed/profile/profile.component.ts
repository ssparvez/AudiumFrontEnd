import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {GeneralService} from "../../../../../services/general/general.service";
import {AppError} from "../../../../../errors/AppError";
import {Profile} from "../../../../../classes/Profile";
import {NotFoundError} from "../../../../../errors/not-found-error";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  followers: number[];
  public currentUser: Account;
  public currentAccountId;
  public currentProfileId;
  public profile: Profile;
  public isOwner: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: GeneralService) {

    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {

    this.route.params.subscribe(param => {
      this.currentProfileId = param['id'];
    });
    this.profile = {};
    this.loadFollowStatus();

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.followers = [1,2,3,4];
  }

  loadProfileInfo() {


    this.service.get('/accounts/' + this.currentProfileId + '/followers').subscribe(
      response => {

      },(error: AppError) => {
      }
    );
  }

  loadFollowStatus() {
    this.service.get('/accounts/' + this.currentAccountId + '/profile/' + this.currentProfileId + '/following').subscribe(
      response => {
        this.profile.isFollowing = true;
      }, (error: AppError) => {
        if ( error instanceof  NotFoundError) {
          console.log('hi');
          this.profile.isFollowing = false;
        }
      }
    );
  }

  isFollowing() {
    return this.profile.isFollowing;
  }

  checkIfOwner() {
    return ( this.currentProfileId === this.currentProfileId);
  }
  changeFollowStatus(status): void {
  }


}
