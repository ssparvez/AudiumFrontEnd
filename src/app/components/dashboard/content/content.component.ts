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
        state('none', style({
            height: '0px'
        })),
        state('maximum', style({
            height: '30px'
        })),
        transition('maximum => none', animate('100ms'))
    ]),
    trigger('adBannerTrigger', [
      state('none', style({
          display: 'none'
      })),
      state('maximum', style({

      })),
      transition('maximum => none', animate('100ms'))
  ])
  ]
})
export class ContentComponent implements OnInit {
  upgradeBannerState = 'maximum';
  adBannerState = 'maximum';

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

  closeUpgradeBanner() {
    this.upgradeBannerState = (this.upgradeBannerState === 'none' ? 'maximum': 'none')
  }
  closeAdBanner() {
    this.adBannerState = (this.adBannerState === 'none' ? 'maximum': 'none')
  }
}
