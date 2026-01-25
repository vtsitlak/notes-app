import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthFacade } from './store/auth.facade';
import { provideRouter } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', [], {
      isLoggedIn: jasmine.createSpy()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is logged in', () => {
    (authFacade.isLoggedIn as jasmine.Spy).and.returnValue(true);
    
    const result = guard.canActivate({} as any, {} as any);
    
    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to login when user is not logged in', () => {
    (authFacade.isLoggedIn as jasmine.Spy).and.returnValue(false);
    
    const result = guard.canActivate({} as any, {} as any);
    
    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
