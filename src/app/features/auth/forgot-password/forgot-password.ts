import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements OnInit {

  loading = false;

  form;

  slug = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {

    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });

  }

  ngOnInit(): void {    

    this.slug =
      this.route.snapshot.queryParamMap.get(
        'slug'
      ) ?? '';

  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.loading = true;

    const email = this.form.value.email ?? '';

    this.authService
      .forgotPassword(
        email,
        this.slug
      )
      .subscribe({
        next: () => {

          this.loading = false;

          this.alertService.success(
            'Se existir uma conta com este e-mail, as instruções de recuperação foram enviadas.'
          );

          this.router.navigate([
            `/${this.slug}/login`
          ]);

        },

        error: () => {

          this.loading = false;

          this.alertService.error(
            'Não foi possível processar a solicitação.'
          );

        }
      });

  }

  voltarParaLogin(): void {

    this.router.navigate([
      `/${this.slug}/login`
    ]);

  }

}