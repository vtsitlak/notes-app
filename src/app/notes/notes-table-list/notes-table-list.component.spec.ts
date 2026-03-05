import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesTableListComponent } from './notes-table-list.component';
import { NotesFacade } from '../store/notes.facade';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { Note } from '../model/note';
import { signal } from '@angular/core';

describe('NotesTableListComponent', () => {
  let component: NotesTableListComponent;
  let fixture: ComponentFixture<NotesTableListComponent>;
  let notesFacade: jasmine.SpyObj<NotesFacade>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockNotes: Note[] = [
    { id: 1, title: 'Note 1', body: 'Body 1', important: false, created: '2024-01-01' },
    { id: 2, title: 'Note 2', body: 'Body 2', important: true, created: '2024-01-02' }
  ];

  beforeEach(async () => {
    const notesFacadeSpy = jasmine.createSpyObj('NotesFacade', ['delete'], {
      notes: signal(mockNotes),
      loading: signal(false)
    });
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue({ subscribe: jasmine.createSpy() });
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    await TestBed.configureTestingModule({
      imports: [NotesTableListComponent],
      providers: [
        provideRouter([]),
        { provide: NotesFacade, useValue: notesFacadeSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTableListComponent);
    component = fixture.componentInstance;
    notesFacade = TestBed.inject(NotesFacade) as jasmine.SpyObj<NotesFacade>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty notes input', () => {
    expect(component.notes()).toEqual([]);
  });

  it('should update dataSource when notes input changes', () => {
    // Set input using componentRef
    (fixture.componentRef as any).setInput('notes', mockNotes);
    fixture.detectChanges();
    
    expect(component.dataSource.data).toEqual(mockNotes);
  });

  it('should apply filter correctly', () => {
    // Set input using componentRef
    (fixture.componentRef as any).setInput('notes', mockNotes);
    fixture.detectChanges();
    
    component.applyFilter('Note 1');
    
    expect(component.dataSource.filter).toBe('note 1');
  });

  it('should call notesFacade.delete when onDeleteCourse is called', () => {
    const note = mockNotes[0];
    component.onDeleteCourse(note);
    
    expect(notesFacade.delete).toHaveBeenCalledWith(note.id);
  });

  it('should open edit dialog when editCourse is called', () => {
    const note = mockNotes[0];
    component.editCourse(note);
    
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should have correct column labels', () => {
    expect(component.label['title']).toBe('Title');
    expect(component.label['created']).toBe('Date Created');
    expect(component.label['important']).toBe('');
  });
});
