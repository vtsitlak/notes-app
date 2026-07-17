import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotesStore } from './notes.store';
import { Note } from '../model/note';

describe('NotesStore', () => {
  let store: InstanceType<typeof NotesStore>;
  let httpMock: HttpTestingController;

  const mockNotes: Note[] = [
    { id: 1, title: 'Note 1', body: 'Body 1', important: false, created: '2024-01-01' },
    { id: 2, title: 'Note 2', body: 'Body 2', important: true, created: '2024-01-02' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    store = TestBed.inject(NotesStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created with empty state', () => {
    expect(store).toBeTruthy();
    expect(store.notes()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(false);
  });

  it('should load all notes', () => {
    store.loadAll();

    expect(store.loading()).toBe(true);

    const req = httpMock.expectOne('/api/notes');
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);

    expect(store.notes()).toEqual(mockNotes);
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(true);
    expect(store.importantNotes()).toEqual([mockNotes[1]]);
  });

  it('should clear loading on load error', () => {
    store.loadAll();

    const req = httpMock.expectOne('/api/notes');
    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(false);
  });

  it('should update a note with PATCH', () => {
    store.loadAll();
    httpMock.expectOne('/api/notes').flush(mockNotes);

    const changes = { title: 'Updated Title' };
    store.update({ noteId: 1, changes });

    const req = httpMock.expectOne('/api/notes/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(changes);
    req.flush({});

    expect(store.notes()[0].title).toBe('Updated Title');
    expect(store.notes()[0].created).toBe('2024-01-01');
  });

  it('should add a note', () => {
    const newNote: Omit<Note, 'id'> = {
      title: 'New Note',
      body: 'Body',
      important: false,
      created: '2024-02-01'
    };
    const created: Note = { ...newNote, id: 3 };

    store.add(newNote);

    const req = httpMock.expectOne('/api/notes');
    expect(req.request.method).toBe('POST');
    req.flush(created);

    expect(store.notes()).toContain(created);
  });

  it('should delete a note', () => {
    store.loadAll();
    httpMock.expectOne('/api/notes').flush(mockNotes);

    store.delete(1);

    const req = httpMock.expectOne('/api/notes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(store.notes().find(n => n.id === 1)).toBeUndefined();
    expect(store.notes().length).toBe(1);
  });
});
