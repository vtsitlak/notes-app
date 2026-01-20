import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authStore = inject(AuthStore);
    private router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        const isLoggedIn = this.authStore.isLoggedIn();
        
        if (!isLoggedIn) {
            this.router.navigateByUrl('/login');
            return false;
        }

        return true;
    }
}
