import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { NotesFacade } from '../store/notes.facade';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let notesFacade: jasmine.SpyObj<NotesFacade>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const notesFacadeSpy = jasmine.createSpyObj('NotesFacade', ['loadAll'], {
      loaded: jasmine.createSpy().and.returnValue(false),
      notes: jasmine.createSpy().and.returnValue([]),
      importantNotes: jasmine.createSpy().and.returnValue([])
    });
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: NotesFacade, useValue: notesFacadeSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    notesFacade = TestBed.inject(NotesFacade) as jasmine.SpyObj<NotesFacade>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAll if not loaded on init', () => {
    (notesFacade.loaded as jasmine.Spy).and.returnValue(false);
    
    component.ngOnInit();
    
    expect(notesFacade.loadAll).toHaveBeenCalled();
  });

  it('should not call loadAll if already loaded', () => {
    (notesFacade.loaded as jasmine.Spy).and.returnValue(true);
    
    component.ngOnInit();
    
    expect(notesFacade.loadAll).not.toHaveBeenCalled();
  });

  it('should call loadAll when reload is called', () => {
    component.reload();
    
    expect(notesFacade.loadAll).toHaveBeenCalled();
  });

  it('should open dialog when onAddCourse is called', () => {
    component.onAddCourse();
    
    expect(dialog.open).toHaveBeenCalled();
  });
});
