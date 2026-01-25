import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../store/auth.facade';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;

  beforeEach(async () => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        { provide: AuthFacade, useValue: authFacadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default email and password', () => {
    const model = component.loginModel();
    expect(model.email).toBe('user1@email.com');
    expect(model.password).toBe('test');
  });

  it('should call authFacade.login when login is called with valid data', () => {
    component.login();
    
    expect(authFacade.login).toHaveBeenCalledWith('user1@email.com', 'test');
  });

  it('should have form validation', () => {
    fixture.detectChanges();
    const form = component.loginForm();
    
    // Form should be valid with default values
    expect(form.invalid()).toBe(false);
  });

  it('should have required validation on email', () => {
    component.loginModel.set({ email: '', password: 'test' });
    fixture.detectChanges();
    
    const form = component.loginForm();
    expect(form.invalid()).toBe(true);
  });

  it('should have required validation on password', () => {
    component.loginModel.set({ email: 'test@email.com', password: '' });
    fixture.detectChanges();
    
    const form = component.loginForm();
    expect(form.invalid()).toBe(true);
  });
});
