import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { NotesStore } from '../notes.store';

@Injectable({
  providedIn: 'root'
})
export class NotesResolver implements Resolve<boolean> {
    private notesStore = inject(NotesStore);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.notesStore.loaded()) {
            this.notesStore.loadAll();
        }
        return true;
    }
}
