import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  private static _scrollResetRouterSubscription;
  public currentUser: JSON;
  public currentAccountRole;

  constructor(
    private router: Router
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountRole = this.currentUser['_role'];
    }
  }

  ngOnInit() {
    if(DashboardComponent.scrollResetRouterSubscription == null) {
      DashboardComponent._scrollResetRouterSubscription = this.router.events.subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0);
      });
      console.log("Dashboard component subscribed to router NavigationEnd events");
    }
  }

  ngOnDestroy() {
    if(DashboardComponent._scrollResetRouterSubscription != null) {
      DashboardComponent._scrollResetRouterSubscription.unsubscribe();
      DashboardComponent._scrollResetRouterSubscription = null;
      console.log("Dashboard component unsubscribed from router NavigationEnd events");
    }
  }

  static get scrollResetRouterSubscription() {
    return DashboardComponent._scrollResetRouterSubscription;
  }
}
