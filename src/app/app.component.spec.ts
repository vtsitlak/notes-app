import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, NavigationStart, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthFacade } from './auth/store/auth.facade';
import { User } from './auth/model/user.model';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let routerEvents$: Subject<unknown>;

  beforeEach(async () => {
    routerEvents$ = new Subject();
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['setUser', 'logout'], {
      isLoggedIn: signal(false),
      isLoggedOut: signal(true),
      user: signal(null)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl'], {
      events: routerEvents$
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
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Notes App"', () => {
    expect(component.title).toBe('Notes App');
  });

  it('should initialize loading as true', () => {
    expect(component.loading()).toBe(true);
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

  it('should expose auth state signals from the facade', () => {
    expect(component.isLoggedIn).toBe(authFacade.isLoggedIn);
    expect(component.isLoggedOut).toBe(authFacade.isLoggedOut);
  });

  it('should toggle loading based on router events', () => {
    component.ngOnInit();

    routerEvents$.next(new NavigationStart(1, '/notes'));
    expect(component.loading()).toBe(true);

    routerEvents$.next(new NavigationEnd(1, '/notes', '/notes'));
    expect(component.loading()).toBe(false);
  });
});
