import {RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";


// Source: https://github.com/angular/angular/issues/10207#issuecomment-268669758
//    If further customization is desired: https://github.com/angular/angular/issues/10207#issuecomment-295655017
export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}

  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle { return null; }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return curr.routeConfig === null && future.routeConfig === null;
  }
}
