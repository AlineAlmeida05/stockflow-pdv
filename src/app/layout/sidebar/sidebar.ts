import { Component, EventEmitter, Output, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { MenuBadge } from '../../core/models/menu-badge.model';
import { ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from '../../core/models/menu-item.model';
import { PromocaoService } from '../../core/services/promocao.service';

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

  promocoesDisponiveis = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private promocaoService: PromocaoService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.carregarDisponibilidadePromocoes();

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

        this.carregarDisponibilidadePromocoes();

        this.cdr.detectChanges();

      });

  }

  private carregarMenu(): void {

    const usuario = this.authService.usuarioLogado();

    if (!usuario) {

      this.menuFiltrado = [];

      return;

    }

    this.menuFiltrado =
      this.menu.filter(item => {

        const possuiPerfil =
          item.perfis.includes(
            usuario.perfil
          );

        if (!possuiPerfil) {
          return false;
        }

        if (
          item.modulo === 'PROMOCOES'
          &&
          !this.promocoesDisponiveis
        ) {
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

  private carregarDisponibilidadePromocoes(): void {

    this.promocaoService
      .existePromocao()
      .subscribe({
        next: response => {

          this.promocoesDisponiveis =
            response.existePromocao;

          this.carregarMenu();

          this.cdr.detectChanges();

        },
        error: erro => {

          console.error(
            'Erro ao verificar promoções',
            erro
          );

        }
      });

  }

}