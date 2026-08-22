import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive,  } from '@angular/router';
import { MENU_CONFIG } from '../../config/menu.config';
import { BRANDING_CONFIG } from '../../config/branding.config';

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

  fecharMenu() {
    this.closeMenu.emit();
  }
}