import {
    ActionReducer,
    ActionReducerMap,
    MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { routerReducer } from '@ngrx/router-store';
import { AuthState, authReducer } from '../auth/reducers';

export interface AppState {
    auth: AuthState;
    router: ReturnType<typeof routerReducer>;
}

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    router: routerReducer
};

export function logger(reducer: ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        console.log('state before: ', state);
        console.log('action', action);

        return reducer(state, action);
    };

}


export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger] : [];


