import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandingService } from './core/services/branding.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stockflow-pdv-frontend');

  constructor(
    private brandingService: BrandingService
  ) {
    this.brandingService.aplicarTema();
  }
}
