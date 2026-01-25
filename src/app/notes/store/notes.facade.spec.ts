import { TestBed } from '@angular/core/testing';
import { NotesFacade } from './notes.facade';
import { NotesStore } from './notes.store';
import { Note } from '../model/note';

describe('NotesFacade', () => {
  let facade: NotesFacade;
  let store: jasmine.SpyObj<any>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('NotesStore', ['loadAll', 'update', 'add', 'delete'], {
      notes: jasmine.createSpy().and.returnValue([]),
      loading: jasmine.createSpy().and.returnValue(false),
      loaded: jasmine.createSpy().and.returnValue(false),
      importantNotes: jasmine.createSpy().and.returnValue([])
    });

    TestBed.configureTestingModule({
      providers: [
        NotesFacade,
        { provide: NotesStore, useValue: storeSpy }
      ]
    });

    facade = TestBed.inject(NotesFacade);
    store = TestBed.inject<any>(NotesStore) as jasmine.SpyObj<any>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose notes signal', () => {
    expect(facade.notes).toBeDefined();
  });

  it('should expose loading signal', () => {
    expect(facade.loading).toBeDefined();
  });

  it('should expose loaded signal', () => {
    expect(facade.loaded).toBeDefined();
  });

  it('should expose importantNotes signal', () => {
    expect(facade.importantNotes).toBeDefined();
  });

  it('should call store.loadAll when loadAll is called', () => {
    facade.loadAll();
    
    expect(store.loadAll).toHaveBeenCalled();
  });

  it('should call store.update when update is called', () => {
    const changes: Partial<Note> = { title: 'Updated Title' };
    facade.update(1, changes);
    
    expect(store.update).toHaveBeenCalledWith({ noteId: 1, changes });
  });

  it('should call store.add when add is called', () => {
    const note: Omit<Note, 'id'> = {
      title: 'New Note',
      body: 'Body',
      important: false,
      created: new Date().toISOString()
    };
    facade.add(note);
    
    expect(store.add).toHaveBeenCalledWith(note);
  });

  it('should call store.delete when delete is called', () => {
    facade.delete(1);
    
    expect(store.delete).toHaveBeenCalledWith(1);
  });
});
