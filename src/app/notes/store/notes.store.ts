import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject, Injector } from '@angular/core';
import { Note } from '../model/note';
import { NotesHttpService } from './notes-http.service';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';


interface NotesState {
  notes: Note[];
  loading: boolean;
  loaded: boolean;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  loaded: false
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    importantNotes: computed(() => store.notes().filter(note => note.important === true))
  })),
  withMethods((store) => {
    const notesHttpService = inject(NotesHttpService);
    const injector = inject(Injector);

    return {
      loadAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            notesHttpService.findAllNotes().pipe(
              tap((notes) => {
                patchState(store, { notes, loading: false, loaded: true });
              }),
              catchError(() => {
                patchState(store, { loading: false });
                return of([]);
              })
            )
          )
        ),
        { injector }
      ),
      update: rxMethod<{ noteId: string | number; changes: Partial<Note> }>(
        pipe(
          switchMap(({ noteId, changes }) =>
            notesHttpService.saveNote(noteId, changes).pipe(
              tap(() => {
                patchState(store, (state) => ({
                  notes: state.notes.map(n =>
                    n.id === noteId ? { ...n, ...changes } : n
                  )
                }));
              })
            )
          )
        ),
        { injector }
      ),
      add: rxMethod<Omit<Note, 'id'> | Note>(
        pipe(
          switchMap((note) =>
            notesHttpService.createNote(note).pipe(
              tap((createdNote) => {
                patchState(store, (state) => ({
                  notes: [...state.notes, createdNote]
                }));
              })
            )
          )
        ),
        { injector }
      ),
      delete: rxMethod<string | number>(
        pipe(
          switchMap((noteId) =>
            notesHttpService.deleteNote(noteId).pipe(
              tap(() => {
                patchState(store, (state) => ({
                  notes: state.notes.filter(n => n.id !== noteId)
                }));
              })
            )
          )
        ),
        { injector }
      )
    };
  })
);
