import { Component, EventEmitter, Output, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { MenuBadge } from '../../core/models/menu-badge.model';
import { ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar implements OnInit {

  @Output()
  closeMenu = new EventEmitter<void>();

  menu = MENU_CONFIG;

  badges: MenuBadge[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
  private authService: AuthService,
  private notificacaoService: NotificacaoService,
  private cdr: ChangeDetectorRef,
) { }

  ngOnInit(): void {

    this.carregarBadges();

    this.cdr.detectChanges();

    this.notificacaoService
      .badgesAtualizados$
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        this.carregarBadges();
        this.cdr.detectChanges();

      });

  }

  fecharMenu(): void {

  this.closeMenu.emit();

}

  get menuFiltrado() {

    const usuario = this.authService.usuarioLogado();

    if (!usuario) {

      return [];

    }

    return this.menu.filter(
      item =>
        item.perfis.includes(
          usuario.perfil
        )
    );

  }

  obterBadge(
    modulo?: string
  ): number {

    const badge =
      this.badges.find(
        badge =>
          badge.modulo === modulo
      );

    return badge?.totalPendencias ?? 0;

  }

  private carregarBadges(): void {

    this.notificacaoService
      .listarBadges()
      .subscribe({
        next: badges => {

          this.badges = badges;

          this.cdr.detectChanges();

        },
        error: erro => {

          console.error(
            'Erro ao carregar badges',
            erro
          );

        }
      });

  }

}