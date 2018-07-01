import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { CustomerAccount } from '../../../classes/CustomerAccount';
import { trigger, state, style, transition, animate, keyframes } from "@angular/core";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('upgradeBannerTrigger', [
      transition(':enter', [
        style({height: '0px'}),
        animate('500ms 2000ms ease-in-out', style({height: '30px'}))
      ]),
      transition(':leave', [
        animate('100ms ease-in-out', style({height: '0px'}))
      ])
    ]),
    trigger('adBannerTrigger', [
      transition(':enter', [
        style({transform: 'translateY(100%)', height: '0%'}),
        animate('500ms ease-in-out', style({transform: 'translateY(0%)', height: '100%'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', height: '100%'}),
        animate('500ms ease-in-out', style({transform: 'translateY(100%)', height: '0%'}))
      ])
    ]),
  ]
})

export class ContentComponent implements OnInit {
  upgradeBannerIsHidden: boolean = false;
  adBannerIsHidden: boolean = false;
  @ViewChild('loadingDiv') loadingDiv: ElementRef;
  @ViewChild('redirectMsgDiv') redirectMsgDiv: ElementRef;
  @ViewChild('mainElement') mainElement: ElementRef;

  public currentUser: JSON;
  public currentAccountRole;

  constructor(
    private router: Router
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountRole = this.currentUser['_role'];
      console.log(this.currentAccountRole);
    }
  }

  ngOnInit() {
    var root = this;

    // Check if session is expired
    if(!this.currentUser){
      // No user info found
      if(root.mainElement != null && root.mainElement.nativeElement != null){
        root.mainElement.nativeElement.style.padding = '0px 0px 0px 1px';
      }

      setTimeout(function(){
        if(!root.currentUser){
          // Still no user info found
          console.log("ERROR: No user info found. Redirecting to login page...");
          // Display error message if no user info is found after the timeout period expires
          if(root.loadingDiv != null && root.loadingDiv.nativeElement != null){
            root.loadingDiv.nativeElement.style.display = 'none';
          }
          if(root.redirectMsgDiv != null && root.redirectMsgDiv.nativeElement != null){
            root.redirectMsgDiv.nativeElement.style.display = 'block';
          }
        } else {
          // User info finally loaded
          if(root.mainElement != null && root.mainElement.nativeElement != null){
            root.mainElement.nativeElement.style.padding = '0px 0px 0px 300px';
          }
          if(root.loadingDiv != null && root.loadingDiv.nativeElement != null){
            root.loadingDiv.nativeElement.style.display = 'none';
          }
          if(root.redirectMsgDiv != null && root.redirectMsgDiv.nativeElement != null){
            root.redirectMsgDiv.nativeElement.style.display = 'none';
          }
        }
      }, 3000);

      setTimeout(function(){
        if(!root.currentUser){
          window.location.replace('/login/true');
        }
      }, 5000); // Redirect to login page if no user info is found after the timeout period expires
    }
  }

  onEnter(keywords: string) {
    this.router.navigate(['/dash/search/', keywords]);
    console.log(keywords);
  }
}
