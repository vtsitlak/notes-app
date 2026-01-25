import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotesHttpService } from './notes-http.service';
import { Note } from '../model/note';
import { provideHttpClient } from '@angular/common/http';

describe('NotesHttpService', () => {
  let service: NotesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotesHttpService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(NotesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all notes', () => {
    const mockNotes: Note[] = [
      { id: 1, title: 'Note 1', body: 'Body 1', important: false, created: '2024-01-01' },
      { id: 2, title: 'Note 2', body: 'Body 2', important: true, created: '2024-01-02' }
    ];

    service.findAllNotes().subscribe(notes => {
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne('/api/notes');
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);
  });

  it('should fetch a note by URL', () => {
    const mockNote: Note = { id: 1, title: 'Note 1', body: 'Body 1', important: false, created: '2024-01-01' };

    service.findNoteByUrl('1').subscribe(note => {
      expect(note).toEqual(mockNote);
    });

    const req = httpMock.expectOne('/api/notes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockNote);
  });

  it('should save a note', () => {
    const changes: Partial<Note> = { title: 'Updated Title' };

    service.saveNote(1, changes).subscribe();

    const req = httpMock.expectOne('/api/notes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changes);
    req.flush({});
  });

  it('should create a note', () => {
    const newNote: Omit<Note, 'id'> = {
      title: 'New Note',
      body: 'Body',
      important: false,
      created: '2024-01-01'
    };
    const createdNote: Note = { ...newNote, id: 1 };

    service.createNote(newNote).subscribe(note => {
      expect(note).toEqual(createdNote);
    });

    const req = httpMock.expectOne('/api/notes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newNote);
    req.flush(createdNote);
  });

  it('should delete a note', () => {
    service.deleteNote(1).subscribe();

    const req = httpMock.expectOne('/api/notes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
