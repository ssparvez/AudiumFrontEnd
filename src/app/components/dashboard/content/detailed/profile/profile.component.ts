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

  public currentUser: Account;
  public currentAccountId;
  public currentProfileId;
  public profile: Profile;
  public isOwner: boolean;
  public isPlaying: boolean;

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
    //this.profile = {};
    this.loadProfileInfo();
    //this.loadFollowStatus();

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
  }

  loadProfileInfo() {
    this.service.get('/profiles/' + this.currentProfileId).subscribe(
      (profile) => {
        this.profile = profile;

        if(this.profile != null){
          if(this.profile.publicProfile){
            // Public profile; retrieve additional profile info

            this.service.get('/profiles/' + this.currentProfileId + '/recent').subscribe(
              (recentSongs) => {
                this.profile.recentSongs = recentSongs;

                this.service.get('/profiles/' + this.currentProfileId + '/playlists').subscribe(
                  (playlists) => {
                    this.profile.createdPlaylists = playlists;

                    this.service.get('/profiles/' + this.currentProfileId + '/following').subscribe(
                      (following) => {
                        this.profile.following = following;

                        this.service.get('/profiles/' + this.currentProfileId + '/followers').subscribe(
                          (followers) => {
                            this.profile.followers = followers;


                          },(error: AppError) => {
                            // Error retrieving followers
                          }
                        );
                      },(error: AppError) => {
                        // Error retrieving list of customers that this user is following
                      }
                    );
                  },(error: AppError) => {
                    // Error retrieving created playlists
                  }
                );
              },(error: AppError) => {
                // Error retrieving recent song plays
              }
            );

          }else{
            // Profile is private
          }
        }else{
          // Failed to find profile
        }
      },(error: AppError) => {
        // Error retrieving profile
      }
    );
  }

  loadFollowStatus() {
    this.service.get('/accounts/' + this.currentAccountId + '/profile/' + this.currentProfileId + '/following').subscribe(
      response => {
        this.profile.isFollowing = true;
      }, (error: AppError) => {
        if ( error instanceof  NotFoundError) {
          console.log('Failed to obtain follow status');
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

  pausePlayback($event: MouseEvent) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlaylist($event: MouseEvent, playlistId) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playbackSong($event: MouseEvent, song) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

}
