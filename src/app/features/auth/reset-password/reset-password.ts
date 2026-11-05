import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {

  loading = false;

  mostrarNovaSenha = false;

  mostrarConfirmarSenha = false;

  token = '';

  tokenValido = false;

  validandoToken = true;

  form;

  slug = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {

    this.form = this.fb.group({
      novaSenha: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmarSenha: [
        '',
        [
          Validators.required
        ]
      ]
    });

  }

  ngOnInit(): void {

    this.token =
      this.route.snapshot.queryParamMap.get(
        'token'
      ) ?? '';

    this.slug =
      this.route.snapshot.queryParamMap.get(
        'slug'
      ) ?? '';

    this.authService
      .validarToken(this.token)
      .subscribe({
        next: response => {

          this.tokenValido = response.valido;

          this.validandoToken = false;

        },

        error: error => {

          this.validandoToken = false;

          this.tokenValido = false;

        },

        complete: () => {

        }
      });

  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const novaSenha = this.form.value.novaSenha ?? '';

    const confirmarSenha = this.form.value.confirmarSenha ?? '';

    if (novaSenha !== confirmarSenha) {

      this.alertService.error(
        'As senhas não conferem.'
      );

      return;

    }

    this.loading = true;

    this.authService
      .resetPassword(
        this.token,
        novaSenha
      )
      .subscribe({
        next: () => {

          this.loading = false;

          this.alertService.success(
            'Senha alterada com sucesso. Faça login com sua nova senha.'
          );

          this.router.navigate([
            '/',
            this.slug,
            'login'
          ]);

        },

        error: () => {

          this.loading = false;

          this.alertService.error(
            'Não foi possível redefinir a senha.'
          );

        }
      });

  }

  solicitarNovoLink(): void {

    this.router.navigate(
      ['/esqueci-minha-senha'],
      {
        queryParams: {
          slug: this.slug
        }
      }
    );

  }

  toggleNovaSenha(): void {

    this.mostrarNovaSenha =
      !this.mostrarNovaSenha;

  }

  toggleConfirmarSenha(): void {

    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;

  }

}