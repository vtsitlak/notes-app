import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNoteDialogComponent } from './edit-note-dialog.component';
import { NotesFacade } from '../store/notes.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { Note } from '../model/note';

describe('EditNoteDialogComponent', () => {
  let component: EditNoteDialogComponent;
  let fixture: ComponentFixture<EditNoteDialogComponent>;
  let notesFacade: jasmine.SpyObj<NotesFacade>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EditNoteDialogComponent>>;

  const mockNote: Note = {
    id: 1,
    title: 'Test Note',
    body: 'Test Body',
    important: false,
    created: '2024-01-01'
  };

  beforeEach(async () => {
    const notesFacadeSpy = jasmine.createSpyObj('NotesFacade', ['update', 'add'], {
      loading: jasmine.createSpy().and.returnValue(false)
    });
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EditNoteDialogComponent],
      providers: [
        provideRouter([]),
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

  it('should initialize form with empty values in create mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [EditNoteDialogComponent],
      providers: [
        provideRouter([]),
        { provide: NotesFacade, useValue: notesFacade },
        { provide: MatDialogRef, useValue: dialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            dialogTitle: 'Create Note',
            mode: 'create'
          }
        }
      ]
    }).compileComponents();

    const createFixture = TestBed.createComponent(EditNoteDialogComponent);
    const createComponent = createFixture.componentInstance;

    const model = createComponent.noteModel();
    expect(model.title).toBe('');
    expect(model.body).toBe('');
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

  it('should call add and close dialog in create mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [EditNoteDialogComponent],
      providers: [
        provideRouter([]),
        { provide: NotesFacade, useValue: notesFacade },
        { provide: MatDialogRef, useValue: dialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            dialogTitle: 'Create Note',
            mode: 'create'
          }
        }
      ]
    }).compileComponents();

    const createFixture = TestBed.createComponent(EditNoteDialogComponent);
    const createComponent = createFixture.componentInstance;
    createComponent.noteModel.set({ title: 'New Note', body: 'New Body', important: false });
    createFixture.detectChanges();

    createComponent.onSave();

    expect(notesFacade.add).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog when onClose is called', () => {
    component.onClose();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should have form validation', () => {
    fixture.detectChanges();
    const form = component.noteForm();

    // Form should be valid with default values
    expect(form.invalid()).toBe(false);
  });
});
