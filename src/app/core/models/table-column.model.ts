type TableColumn = {
    field: string;
    header: string;
    type?:
    | 'text'
    | 'badge'
    | 'currency'
    | 'date'
    | 'toggle'
    | 'progress';
    align?:
    | 'left'
    | 'center'
    | 'right';
    badgeVariantField?: string;
    toggleActiveValue?: string;
    toggleActiveLabel?: string;
    toggleInactiveLabel?: string;
};