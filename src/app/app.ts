import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandingService } from './core/services/branding.service';
import { TenantContextService } from './core/services/tenant-context.service';
import { ToastComponent } from './shared/components/toast/toast';
import { AuthStateService } from './core/services/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('stockflow-pdv-frontend');

  constructor(
    private brandingService: BrandingService,
    private tenantContextService: TenantContextService,
    private authStateService: AuthStateService
  ) {
    this.brandingService.aplicarTema();
  }

  ngOnInit(): void {

    this.authStateService
      .inicializar();

    console.log(
      window.location.pathname
    );

  }

}
