import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild
//, CanDeactivate<unknown>, CanLoad 
{

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return true;
        }
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.canActivate(route, state);
    }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     let url: string = state.url;
    //     return this.checkUserLogin(next, url);
    // }
    // canActivateChild(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     return this.canActivate(next, state);
    // }
    // canDeactivate(
    //     component: unknown,
    //     currentRoute: ActivatedRouteSnapshot,
    //     currentState: RouterStateSnapshot,
    //     nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     return true;
    // }
    // canLoad(
    //     route: Route,
    //     segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    //     return true;
    // }

    // checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    //     if (this.authService.isLoggedIn()) {
    //         // const userRole = this.authService.getRole();
    //         // if (route.data.role && route.data.role.indexOf(userRole) === -1) {
    //         //     this.router.navigate(['/#/passport/login']);
    //         //     return false;
    //         // }
    //         // return true;

    //         this.router.navigate(['/dashboard'])
    //         return true;
    //     }

    //     this.router.navigate(['/passport/login']);
    //     return false;
    // }
}