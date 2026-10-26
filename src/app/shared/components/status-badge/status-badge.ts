import { Component, Input } from '@angular/core';

type BadgeVariant =
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    templateUrl: './status-badge.html',
    styleUrl: './status-badge.scss'
})
export class StatusBadge {

    @Input({ required: true })
    text!: string;

    @Input()
    icon = '';

    @Input()
    autoVariant = false;

    @Input()
    variant: BadgeVariant = 'info';

    get resolvedVariant(): BadgeVariant {

        if (!this.autoVariant) {

            return this.variant;

        }

        const value = this.text.toLowerCase();

        if (
            this.successValues.some(
                item => value.includes(item)
            )
        ) {
            return 'success';
        }

        if (
            this.warningValues.some(
                item => value.includes(item)
            )
        ) {
            return 'warning';
        }

        if (
            this.dangerValues.some(
                item => value.includes(item)
            )
        ) {
            return 'danger';
        }

        return 'info';

    }

    private readonly successValues: string[]  = [
        'ativo',
        'finalizada',
        'em dia',
        'recente',
        'giro alto'
    ];

    private readonly warningValues: string[]  = [
        'atenção',
        'média',
        'pendente',
        'giro médio'
    ];

    private readonly dangerValues: string[]  = [
        'cancelada',
        'crítico',
        'inadimplente',
        'produto parado',
        'giro baixo',
        'alta'
    ];

}