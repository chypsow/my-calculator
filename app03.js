import { $, $all, el, createHeader, fmtCurrency, fmtDate, fmtDecimal } from './main.js';

export function buildApp03() {
    $('#app03').append(
        createHeader('LENING - AFLOSSINGSTABEL'),
        createCalculator()
    );
    $('#generateTableBtn').addEventListener('click', generateAmortizationTable);
}

function createCalculator() {
    return el('section', { class: 'calculator-section' }, [
        el('div', { class: 'input-group' }, [
            el('label', { for: 'loanAmount', text: 'Lening Bedrag (€):' }),
            el('input', { type: 'number', id: 'loanAmount', min: '0', step: '0.01', value: '10000' })
        ]),
        el('div', { class: 'input-group' }, [
            el('label', { for: 'annualInterestRate', text: 'Jaarlijkse Rente (%):' }),
            el('input', { type: 'number', id: 'annualInterestRate', min: '0', step: '0.01', value: '5' })
        ]),
        el('div', { class: 'input-group' }, [
            el('label', { for: 'loanTermMonths', text: 'Looptijd (maanden):' }),
            el('input', { type: 'number', id: 'loanTermMonths', min: '1', step: '1', value: '60' })
        ]),
        el('button', { id: 'generateTableBtn', text: 'Genereer Aflossingstabel' }),
        el('div', { id: 'amortizationTableContainer' })
    ]);
}