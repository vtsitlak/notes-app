import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';
import { AuthStore } from './auth.store';
import { User } from '../model/user.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: jasmine.SpyObj<AuthStore>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('AuthStore', ['login', 'logout', 'setUser'], {
      user: jasmine.createSpy().and.returnValue(null),
      isLoggedIn: jasmine.createSpy().and.returnValue(false),
      isLoggedOut: jasmine.createSpy().and.returnValue(true)
    });

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthStore, useValue: storeSpy }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(AuthStore) as jasmine.SpyObj<AuthStore>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose user signal', () => {
    expect(facade.user).toBeDefined();
  });

  it('should expose isLoggedIn signal', () => {
    expect(facade.isLoggedIn).toBeDefined();
  });

  it('should expose isLoggedOut signal', () => {
    expect(facade.isLoggedOut).toBeDefined();
  });

  it('should call store.login when login is called', () => {
    facade.login('test@email.com', 'password');
    
    expect(store.login).toHaveBeenCalledWith({ email: 'test@email.com', password: 'password' });
  });

  it('should call store.logout when logout is called', () => {
    facade.logout();
    
    expect(store.logout).toHaveBeenCalled();
  });

  it('should call store.setUser when setUser is called', () => {
    const user: User = { id: 1, email: 'test@email.com' };
    facade.setUser(user);
    
    expect(store.setUser).toHaveBeenCalledWith(user);
  });
});
