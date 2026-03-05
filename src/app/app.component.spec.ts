import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthFacade } from './auth/store/auth.facade';
import { provideRouter } from '@angular/router';
import { User } from './auth/model/user.model';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['setUser', 'logout'], {
      isLoggedIn: jasmine.createSpy().and.returnValue(false),
      isLoggedOut: jasmine.createSpy().and.returnValue(true),
      user: jasmine.createSpy().and.returnValue(null)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl'], {
      events: new Subject()
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Notes App"', () => {
    expect(component.title).toBe('Notes App');
  });

  it('should initialize loading as true', () => {
    expect(component.loading).toBe(true);
  });

  it('should call authFacade.setUser if user exists in localStorage', () => {
    const userProfile: User = { id: '1', name: 'Test User', email: 'test@email.com' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userProfile));
    
    component.ngOnInit();
    
    expect(authFacade.setUser).toHaveBeenCalledWith(userProfile);
  });

  it('should not call authFacade.setUser if no user in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    component.ngOnInit();
    
    expect(authFacade.setUser).not.toHaveBeenCalled();
  });

  it('should call authFacade.logout when logout is called', () => {
    component.logout();
    
    expect(authFacade.logout).toHaveBeenCalled();
  });
});
