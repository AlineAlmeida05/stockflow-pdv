import { Component, EventEmitter, Output, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { MenuBadge } from '../../core/models/menu-badge.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from '../../core/models/menu-item.model';

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

  menuFiltrado: MenuItem[] = [];

  badges: MenuBadge[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.carregarMenu();

    this.carregarBadges();

    this.notificacaoService
      .badgesAtualizados$
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        this.carregarBadges();

      });

  }

  private carregarMenu(): void {

    const usuario = this.authService.usuarioLogado();

    if (!usuario) {

      this.menuFiltrado = [];

      return;

    }

    this.menuFiltrado = this.menu.filter(item => {

      const possuiPerfil =
        item.perfis.includes(
          usuario.perfil
        );

      if (!possuiPerfil) {
        return false;
      }

      return true;

    });

  }

  fecharMenu(): void {

    this.closeMenu.emit();

  }

  obterBadge(
    modulo?: string
  ): number {

    const badge = this.badges.find(
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