import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: number) {
    return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number: number) {
    return numeral(number / 100).format('0.0%');
}

export function fNumber(number: number) {
    return numeral(number).format();
}

export function fShortenNumber(number: number) {
    return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number: number) {
    return numeral(number).format('0.0 b');
}
