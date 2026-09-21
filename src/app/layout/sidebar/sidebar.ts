import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { MenuBadge } from '../../core/models/menu-badge.model';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

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

  fecharMenu() {
    this.closeMenu.emit();
  }

  get menuFiltrado() {

    const usuario =
      this.authService
        .usuarioLogado();

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

}