import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNoteDialogComponent } from './edit-note-dialog.component';
import { NotesFacade } from '../store/notes.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Note } from '../model/note';
import { signal } from '@angular/core';

describe('EditNoteDialogComponent', () => {
  const mockNote: Note = {
    id: 1,
    title: 'Test Note',
    body: 'Test Body',
    important: false,
    created: '2024-01-01'
  };

  describe('update mode', () => {
    let component: EditNoteDialogComponent;
    let fixture: ComponentFixture<EditNoteDialogComponent>;
    let notesFacade: jasmine.SpyObj<NotesFacade>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<EditNoteDialogComponent>>;

    beforeEach(async () => {
      const notesFacadeSpy = jasmine.createSpyObj('NotesFacade', ['update', 'add'], {
        loading: signal(false)
      });
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

      await TestBed.configureTestingModule({
        imports: [EditNoteDialogComponent],
        providers: [
          provideRouter([]),
          provideAnimations(),
          { provide: NotesFacade, useValue: notesFacadeSpy },
          { provide: MatDialogRef, useValue: dialogRefSpy },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              dialogTitle: 'Edit Note',
              note: mockNote,
              mode: 'update'
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(EditNoteDialogComponent);
      component = fixture.componentInstance;
      notesFacade = TestBed.inject(NotesFacade) as jasmine.SpyObj<NotesFacade>;
      dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditNoteDialogComponent>>;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with note data in update mode', () => {
      expect(component.dialogTitle).toBe('Edit Note');
      expect(component.note).toEqual(mockNote);
      expect(component.mode).toBe('update');
    });

    it('should initialize form with note values in update mode', () => {
      const model = component.noteModel();
      expect(model.title).toBe('Test Note');
      expect(model.body).toBe('Test Body');
      expect(model.important).toBe(false);
    });

    it('should call update and close dialog in update mode', () => {
      component.noteModel.set({ title: 'Updated', body: 'Updated Body', important: true });
      fixture.detectChanges();

      component.onSave();

      expect(notesFacade.update).toHaveBeenCalledWith(mockNote.id, {
        title: 'Updated',
        body: 'Updated Body',
        important: true
      });
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog when onClose is called', () => {
      component.onClose();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should have valid form with default values', () => {
      fixture.detectChanges();
      expect(component.noteForm().invalid()).toBe(false);
    });

    it('should mark title invalid when empty', () => {
      component.noteModel.set({ title: '', body: 'Body', important: false });
      fixture.detectChanges();

      expect(component.noteForm.title().invalid()).toBe(true);
      expect(component.noteForm().invalid()).toBe(true);
    });
  });

  describe('create mode', () => {
    let component: EditNoteDialogComponent;
    let fixture: ComponentFixture<EditNoteDialogComponent>;
    let notesFacade: jasmine.SpyObj<NotesFacade>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<EditNoteDialogComponent>>;

    beforeEach(async () => {
      const notesFacadeSpy = jasmine.createSpyObj('NotesFacade', ['update', 'add'], {
        loading: signal(false)
      });
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

      await TestBed.configureTestingModule({
        imports: [EditNoteDialogComponent],
        providers: [
          provideRouter([]),
          provideAnimations(),
          { provide: NotesFacade, useValue: notesFacadeSpy },
          { provide: MatDialogRef, useValue: dialogRefSpy },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              dialogTitle: 'Create Note',
              mode: 'create'
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(EditNoteDialogComponent);
      component = fixture.componentInstance;
      notesFacade = TestBed.inject(NotesFacade) as jasmine.SpyObj<NotesFacade>;
      dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditNoteDialogComponent>>;
    });

    it('should initialize form with empty values', () => {
      const model = component.noteModel();
      expect(model.title).toBe('');
      expect(model.body).toBe('');
      expect(model.important).toBe(false);
    });

    it('should call add with created timestamp and close dialog', () => {
      component.noteModel.set({ title: 'New Note', body: 'New Body', important: false });
      fixture.detectChanges();

      component.onSave();

      expect(notesFacade.add).toHaveBeenCalled();
      const added = notesFacade.add.calls.mostRecent().args[0] as Omit<Note, 'id'>;
      expect(added.title).toBe('New Note');
      expect(added.body).toBe('New Body');
      expect(added.created).toBeTruthy();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
