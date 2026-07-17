import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { MatSidenavContainer, MatSidenav } from '@angular/material/sidenav';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthFacade } from './auth/store/auth.facade';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterOutlet,
        RouterLink,
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        MatListItem,
        MatIcon,
        MatToolbar,
        MatIconButton,
        MatTooltip,
        MatProgressSpinner
    ]
})
export class AppComponent implements OnInit {

    title = 'Notes App';

    loading = signal(true);

    private authFacade = inject(AuthFacade);
    private router = inject(Router);

    // Expose store signals on the component so OnPush templates stay in sync after login
    readonly isLoggedIn = this.authFacade.isLoggedIn;
    readonly isLoggedOut = this.authFacade.isLoggedOut;

    ngOnInit() {

        const userProfile = localStorage.getItem('user');

        if (userProfile) {
            this.authFacade.setUser(JSON.parse(userProfile));
        }

        this.router.events.subscribe(event => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading.set(true);
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading.set(false);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    logout() {
        this.authFacade.logout();
    }

}
