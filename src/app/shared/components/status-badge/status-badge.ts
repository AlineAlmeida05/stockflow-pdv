import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    templateUrl: './status-badge.html',
    styleUrl: './status-badge.scss'
})
export class StatusBadge {

    @Input()
    text = '';

    @Input()
    icon = '';

    @Input()
    autoVariant = false;

    @Input()
    variant:
        | 'success'
        | 'warning'
        | 'danger'
        | 'info'
        = 'info';

    get resolvedVariant():
        'success'
        | 'warning'
        | 'danger'
        | 'info' {

        if (!this.autoVariant) {

            return this.variant;

        }

        const value =
            this.text.toLowerCase();

        if (
            value.includes('ativo')
            ||
            value.includes('finalizada')
            ||
            value.includes('em dia')
            ||
            value.includes('recente')
            ||
            value.includes('giro alto')
        ) {

            return 'success';

        }

        if (
            value.includes('atenção')
            ||
            value.includes('média')
            ||
            value.includes('pendente')
            ||
            value.includes('giro médio')
        ) {

            return 'warning';

        }

        if (
            value.includes('cancelada')
            ||
            value.includes('crítico')
            ||
            value.includes('inadimplente')
            ||
            value.includes('produto parado')
            ||
            value.includes('giro baixo')
            ||
            value.includes('alta')
        ) {

            return 'danger';

        }

        return 'info';

    }

}