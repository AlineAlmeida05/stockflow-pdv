import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { ToastComponent } from '../../shared/components/toast/toast';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    Sidebar,
    Header,
    ToastComponent,
    ConfirmDialog
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})

export class MainLayout {

}