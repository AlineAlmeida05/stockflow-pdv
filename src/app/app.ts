import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TenantContextService } from './core/services/tenant-context.service';
import { ToastComponent } from './shared/components/toast/toast';

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
  private tenantContextService: TenantContextService
) {
}

  ngOnInit(): void {

    console.log(
      window.location.pathname
    );

  }

}
