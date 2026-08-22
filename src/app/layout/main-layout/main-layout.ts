import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
// import { Header } from '../../shared/components/header/header';
import { ToastComponent } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    Sidebar,
    // Header
    ToastComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {

}