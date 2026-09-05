import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.form = this.fb.group({

            email: [

                '',

                [
                    Validators.required,

                    Validators.email

                ]

            ],

            senha: [

                '',

                [

                    Validators.required

                ]

            ]
        })

    }

    submit(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.authService
            .login(this.form.value)
            .subscribe({
                next: usuario => {

                    console.log(
                        'Login realizado:',
                        usuario
                    );

                    this.router.navigate([
                        this.authService.rotaInicial()
                    ]);

                },

                error: erro => {
                    console.error('Erro ao realizar login:', erro);
                }
            });
    }
}