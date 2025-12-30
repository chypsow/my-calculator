import { $, el, createHeader, fmtCurrency, fmtDate, t } from './main.js';
import { parseInputs, computeRemaining, updateSummary, hasMonthYearChanged } from './tab01_Main.js';

export function createTab03() {
    $('#tab03').append(
        createHeader('header.loan-reports'),
        createReportContainer()
    );

    /*$('#startdatum-status').addEventListener('change', function() {
        if (hasMonthYearChanged(this)) $all('.output-tab02').forEach(el => el.textContent = '');
    });

    $('#einddatum-status').addEventListener('change', function() {
        if (hasMonthYearChanged(this)) $all('.output-tab02').forEach(el => el.textContent = '');
    });

    $('#berekenBtn2').addEventListener('click', calculteTotals);*/
}

function createReportContainer() {
    return el('div', { class: 'main-container' }, [
        createOverzicht(),
        createKeuzeContainer()
    ]);
}

function createOverzicht() {
    return el("div", { class: "overzicht" }, [
        el('div', { class: 'overzicht-header', html: `<h2 data-i18n="section.loan-overview">${t('section.loan-overview')}</h2><span><span data-i18n="label.today">${t('label.today')}</span> <span>${fmtDate(new Date())}</span></span>` }),
        el('div', { class: 'overzicht-inhoud' }, [
            el("div", { html: `
                <p> <span data-i18n="output.loan-amount">${t('output.loan-amount')}</span>
                    <span class="output-overview loan-amount"></span>
                </p>
                <p> <span data-i18n="output.monthly-payment">${t('output.monthly-payment')}</span>
                    <span class="output-overview monthly-payment"></span>
                </p>
                <p> <span data-i18n="output.monthly-rate">${t('output.monthly-rate')}</span>
                    <span class="output-overview monthly-rate"></span>
                </p>
                <p> <span data-i18n="output.total-interest">${t('output.total-interest')}</span>
                    <span class="output-overview total-interest"></span>
                </p>
            `}),
            el("div", { html: `
                <p> <span data-i18n="label.start-date">${t('label.start-date')}</span>
                    <span  class="output-overview startDateDisplay"></span>
                </p>
                <p> <span data-i18n="label.end-date">${t('label.end-date')}</span>
                    <span class="output-overview endDateDisplay"></span>
                </p>
                <p> <span data-i18n="output.loan-period">${t('output.loan-period')}</span>
                    <span class="output-overview loan-period"></span>
                </p>
                <p> <span data-i18n="output.remaining-duration">${t('output.remaining-duration')}</span>
                    <span class="output-overview remaining-duration"></span>
                </p>
            `})
        ])
    ]);
}

function createKeuzeContainer() {
    return el('div', { class: 'keuze-container' }, [
        el('h2', { "data-i18n": "section.report-header", text: t('section.report-header') }),
        createRadioKeuze(),
        createExecuteButton()
    ]);
}

function createRadioKeuze() {
    return el('div', { class: 'radio-keuze' }, [
        el('label', { html: `<input type="radio" name="reportDescription" value="annual-overview" checked> <span data-i18n="label.annual-report">${t('label.annual-report')}</span>` }),
        el('label', { html: `<input type="radio" name="reportDescription" value="detailed"> <span data-i18n="label.detailed-report">${t('label.detailed-report')}</span>` })
    ]);
}

function createExecuteButton() {
    return el('button', { id: 'executeBtn', class: 'accented-btn', "data-i18n": "button.execute", text: t('button.execute') });
}