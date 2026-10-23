export type FormaPagamento =
    | 'pix'
    | 'dinheiro'
    | 'debito'
    | 'credito'
    | 'fiado';

export const FORMA_PAGAMENTO_LABELS:
    Record<FormaPagamento, string> = {

    pix: 'PIX',

    dinheiro: 'Dinheiro',

    debito: 'Débito',

    credito: 'Crédito',

    fiado: 'Fiado'
};

export const FORMA_PAGAMENTO_ICONS:
    Record<FormaPagamento, string> = {

    pix: '📱',

    dinheiro: '💵',

    debito: '💳',

    credito: '💳',

    fiado: '📒'
};

export const FORMA_PAGAMENTO_OPTIONS =
    Object.entries(
        FORMA_PAGAMENTO_LABELS
    ).map(
        ([value, label]) => ({
            value,
            label
        })
    );

export const FORMA_PAGAMENTO_PADRAO = 'Selecione...' as const;

export type FormaPagamentoTela = typeof FORMA_PAGAMENTO_PADRAO
    | FormaPagamento;

