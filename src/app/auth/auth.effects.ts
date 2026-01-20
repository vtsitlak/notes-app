import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class AuthEffects {
    private actions$: Actions;
    private router: Router;

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.login),
            tap(action => localStorage.setItem('user',
                JSON.stringify(action.user))
            )
        );
    }, { dispatch: false });

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(action => {
                localStorage.removeItem('user');
                this.router.navigateByUrl('/login');
            })
        );
    }, { dispatch: false });

    constructor(
        actions$: Actions,
        router: Router
    ) {
        this.actions$ = actions$;
        this.router = router;
    }
}
