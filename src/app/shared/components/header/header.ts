import { Component } from '@angular/core';
import { COMPANY_CONFIG } from '../../../config/company.config';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  company = COMPANY_CONFIG;
}