import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { BRANDING_CONFIG } from '../../config/branding.config';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {

  @Output()
  closeMenu = new EventEmitter<void>();

  branding = BRANDING_CONFIG;

  menu = MENU_CONFIG;

  constructor(
    private authService: AuthService
  ) { }

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
}