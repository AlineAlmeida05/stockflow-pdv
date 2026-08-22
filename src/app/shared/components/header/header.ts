import { Component } from '@angular/core';

import { BRANDING_CONFIG }
from '../../../config/branding.config';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {

    branding =
        BRANDING_CONFIG;

}