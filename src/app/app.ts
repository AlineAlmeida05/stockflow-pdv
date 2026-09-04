import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandingService } from './core/services/branding.service';
import { TenantContextService } from './core/services/tenant-context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('stockflow-pdv-frontend');

  constructor(
    private brandingService: BrandingService,
    private tenantContextService: TenantContextService
  ) {
    this.brandingService.aplicarTema();
  }

  ngOnInit(): void {

    console.log(
      window.location.pathname
    );

  }

}
