import { shape, number, string, bool } from 'prop-types';

export const mediaGalleryEntry = shape({
    id: number.isRequired,
    media_type: string.isRequired,
    label: string,
    position: number.isRequired,
    disabled: bool.isRequired,
    file: string.isRequired
});

export const currencyAmount = shape({
    currency: string.isRequired,
    value: number.isRequired
});

export const price = shape({
    amount: currencyAmount.isRequired
});
