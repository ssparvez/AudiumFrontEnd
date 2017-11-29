import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CustomerAccount } from '../../../classes/CustomerAccount';
import { trigger, state, style, transition, animate, keyframes} from "@angular/core";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('upgradeBannerTrigger', [
      transition(':enter', [
        style({height: '0px'}),
        animate('500ms ease-in-out', style({height: '30px'}))
      ]),
      transition(':leave', [
        style({height: '30px'}),
        animate('200ms ease-in-out', style({height: '0px'}))
      ])
    ]),
    trigger('adBannerTrigger', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),        
        animate('500ms ease-in-out', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)'}),        
        animate('500ms ease-in-out', style({transform: 'translateY(100%)'}))
      ])
    ]),
  ]
})
export class ContentComponent implements OnInit {
  upgradeBannerIsHidden = false;
  adBannerIsHidden = false;

  public currentUser: JSON;
  public currentAccountRole;

  constructor(private router: Router) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountRole = this.currentUser['_role'];
    console.log(this.currentAccountRole);
  }

  ngOnInit() {
  }

  onEnter(keywords: string) {
    this.router.navigate(['/dash/search/', keywords]);
    console.log(keywords);
  }
}
