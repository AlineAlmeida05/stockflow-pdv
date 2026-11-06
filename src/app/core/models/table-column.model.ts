type TableColumn = {
    field: string;
    header: string;
    type?:
    | 'text'
    | 'badge'
    | 'currency'
    | 'date'
    | 'toggle'
    | 'progress'
    | 'action'
    | 'quantity-control';
    align?:
    | 'left'
    | 'center'
    | 'right';
    badgeVariantField?: string;
    toggleActiveValue?: string;
    toggleActiveLabel?: string;
    toggleInactiveLabel?: string;
};