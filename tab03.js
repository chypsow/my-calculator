import { $, el, createHeader, createFmtCurrency, t } from './main.js';

export function createTab03() {
    const tab03 = el('div', { id: 'tab03', class: 'tab-content' });
    const header = createHeader('header.salary-simulator');
    tab03.appendChild(header);
    $('main').appendChild(tab03);
}