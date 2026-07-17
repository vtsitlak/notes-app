import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { User } from '../model/user.model';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser: User = { id: '1', name: 'user1', email: 'user1@email.com' };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    store = TestBed.inject(AuthStore);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should start logged out when localStorage has no user', () => {
    expect(store.user()).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
    expect(store.isLoggedOut()).toBe(true);
  });

  it('should login, persist user, and navigate to notes', () => {
    store.login({ email: 'user1@email.com', password: 'test' });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user1@email.com', password: 'test' });
    req.flush(mockUser);

    expect(store.user()).toEqual(mockUser);
    expect(store.isLoggedIn()).toBe(true);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/notes');
  });

  it('should logout, clear storage, and navigate to login', () => {
    store.setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));

    store.logout();

    expect(store.user()).toBeNull();
    expect(store.isLoggedOut()).toBe(true);
    expect(localStorage.getItem('user')).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should setUser without HTTP', () => {
    store.setUser(mockUser);

    expect(store.user()).toEqual(mockUser);
    expect(store.isLoggedIn()).toBe(true);
  });
});
