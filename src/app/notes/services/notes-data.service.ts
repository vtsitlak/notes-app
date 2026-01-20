import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class NotesDataService extends DefaultDataService<Note> {


    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Note', http, httpUrlGenerator);

    }
    entityUrl = '/api/notes/';

    getAll(): Observable<Note[]> {
        return this.http.get<Note[]>('/api/notes')
            .pipe(
                map((notes: Note[]) => notes)
            );
    }
}
