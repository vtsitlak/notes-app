import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthStore } from '../auth.store';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [MatCard, MatCardTitle, MatCardContent, ReactiveFormsModule, MatFormField, MatInput, MatButton]
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    authStore = inject(AuthStore);

    constructor(
        private fb: FormBuilder,
        private router: Router) {

        this.form = fb.group({
            email: ['user1@email.com', [Validators.required]],
            password: ['test', [Validators.required]]
        });

    }

    ngOnInit() {

    }

    login() {
        const val = this.form.value;
        this.authStore.login({ email: val.email, password: val.password });
        // Navigation is handled by the store's login method via router.navigateByUrl
    }

}

