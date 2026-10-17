import { of } from 'rxjs';
import { vi } from 'vitest';

export const notificacaoServiceMock = {

    listarBadges: vi.fn(
        () => of([])
    ),

    badgesAtualizados$: of(),

    notificarAtualizacaoBadges: vi.fn()

};