import { $, el, createHeader, fmtCurrency, fmtDate } from './main.js';
import { parseInputs, monthlyRate, computePayment, updateSummary } from './app01.js';

export function buildApp03() {
    $('#app03').append(
        createHeader('LENING - AFLOSSINGSTABEL'),
        createTable()
    );
    //preparePrintOverview();
    $('#aflossingBtn').addEventListener('click', () => {
        if ($("#aflossingstabel").hidden) {
            generateSchedule();
        } else {
            $("#aflossingstabel").hidden = true;
            $("#afdrukken").style.visibility = "hidden";
        }
    });
    $('#afdrukken').addEventListener('click', printData);
}

function generateSchedule() {
    const inputs = parseInputs();
    if (!inputs) return;
    const { bedrag, jkp, periode, renteType: type, startDate } = inputs;
    const i = monthlyRate(jkp, type);
    const betaling = computePayment(bedrag, i, periode);

    $("#tableInhoud").innerHTML = "";
    $("#aflossingstabel").hidden = false;
    $("#afdrukken").style.visibility = "visible";

    // Start date
    // startDateValue = $("#startDatum").valueAsDate;
    let currentDate = new Date(startDate);
    //$('#startDatum').valueAsDate = currentDate;
    //$('#eindDatum').textContent = `Einddatum: ${fmtDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + periode, currentDate.getDate()))}`;
    //$("#eindDatum").classList.remove("eind-datum-hidden");
    //updateSummary();
    // Ensure we show the starting month as provided (don't move before first row)
    
    let balance = bedrag;
    let cumInterest = 0;
    let cumPrincipal = 0;

    for (let n = 1; n <= periode; n++) {
        const tr = document.createElement("tr");

        // Date: increment month for each payment (payment at end of period)
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());

        const interest = balance * i;
        const principal = Math.min(betaling - interest, balance); // last payment protection
        const payment = principal + interest;
        const newBalance = Math.max(balance - principal, 0);

        cumInterest += interest;
        cumPrincipal += principal;

        const cells = [
            n,
            fmtDate(currentDate),
            fmtCurrency.format(balance),
            fmtCurrency.format(payment),
            fmtCurrency.format(principal),
            fmtCurrency.format(interest),
            fmtCurrency.format(newBalance),
            fmtCurrency.format(cumInterest),
            fmtCurrency.format(cumPrincipal),
            fmtCurrency.format(payment * n)
        ];

        for (const c of cells) {
            const td = document.createElement("td");
            td.textContent = c;
            tr.appendChild(td);
        }

        $("#tableInhoud").appendChild(tr);
        balance = newBalance;
        if (balance <= 0) break;
    }
}

function createTable() {
    
    return el("div", { id: "managerTable", class: "print-container" }, [
        el("ul", {
            id: "leningOverzicht",
            class: "lening-overzicht on-print",
            //hidden: true
        }),
        el("div", { class: "button-group no-print" }, [
            el("button", {id: "aflossingBtn", class: "bereken-btn no-print", text: "Aflossingstabel"}),
            el("button", {id: "afdrukken", class: "bereken-btn no-print", text: "Afdrukken"})
        ]),
        el("table", { id: "aflossingstabel" }, [
            el("thead", { id: "tableHeader", class: "table-header", html: `
                <tr>
                    <th>No</th>
                    <th>Datum</th>
                    <th>Begin kapitaal</th>
                    <th>Aflossing totaal</th>
                    <th>Aflossing kapitaal</th>
                    <th>Aflossing rente</th>
                    <th>Uitstaand kapitaal</th>
                    <th>Cumulatieve interesten</th>
                    <th>Cumulatief afbetaald KPT</th>
                    <th>Cumulatif aflossing</th>
                </tr>
            `}),
            el("tbody", {
                id: "tableInhoud",
                class: "table-inhoud"
            })
        ])
    ]);
}
export function preparePrintOverview() {
    const inputs = parseInputs();
    if (!inputs) {
        $("#aflossingstabel").hidden = true;
        $("#afdrukken").style.visibility = "hidden";
        $("#aflossingBtn").style.visibility = "hidden";
        $("#leningOverzicht").hidden = true;
        return;
    }

    $("#leningOverzicht").innerHTML = "";
    $("#leningOverzicht").hidden = false;
    $("#aflossingBtn").style.visibility = "visible";

    updateSummary();
    const li = (text) => {
        const el = document.createElement("li");
        el.textContent = text;
        $("#leningOverzicht").appendChild(el);
    };
    li("Te lenen bedrag: " + fmtCurrency.format(inputs.bedrag));
    li("JKP: " + (inputs.jkp.toString().replace('.', ',') || "-") + " %");
    li("Maandelijkse rentevoet: " + ($("#rente-1").textContent || "-"));
    li("Maandelijkse aflossing: " + ($("#pmt-1").textContent || "-"));
    li("Totaal interesten: " + ($("#interesten-1").textContent || "-"));
    li("Periode: " + (inputs.periode || "-") + " maanden");
    li("Startdatum: " + fmtDate(inputs.startDate));
    //const endDate = new Date(inputs.startDate);
    //endDate.setMonth(endDate.getMonth() + inputs.periode);
    li("Einddatum: " + ($('#endDatumDisplay').textContent || "-"));
    //$("#leningOverzicht").style.columnCount = "2";
    //$("#leningOverzicht").hidden = false;
}
function printData() {
    //preparePrintOverview();
    window.print();
}
/*function createCalculator() {
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
        el('button', { id: 'generateTableBtn', class: 'bereken-btn', text: 'Genereer Aflossingstabel' }),
        el('div', { id: 'amortizationTableContainer' })
    ]);
}
function generateAmortizationTable() {
    const loanAmount = parseFloat($('#loanAmount').value);
    const annualInterestRate = parseFloat($('#annualInterestRate').value) / 100;
    const loanTermMonths = parseInt($('#loanTermMonths').value);
    const monthlyInterestRate = annualInterestRate / 12;

    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
    let balance = loanAmount;
    const tableContainer = $('#amortizationTableContainer');
    tableContainer.innerHTML = '';

    const table = el('table', { class: 'amortization-table' }, [
        el('thead', {}, [
            el('tr', {}, [
                el('th', { text: 'Maand' }),
                el('th', { text: 'Betaling (€)' }),
                el('th', { text: 'Rente (€)' }),
                el('th', { text: 'Aflossing (€)' }),
                el('th', { text: 'Restant Schuld (€)' })
            ])
        ]),
        el('tbody')
    ]);
    const tbody = table.querySelector('tbody');

    for (let month = 1; month <= loanTermMonths; month++) {
        const interestPayment = balance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        const row = el('tr', {}, [
            el('td', { text: month.toString() }),
            el('td', { text: fmtDecimal(2).format(monthlyPayment) }),   
            el('td', { text: fmtDecimal(2).format(interestPayment) }),
            el('td', { text: fmtDecimal(2).format(principalPayment) }),
            el('td', { text: fmtDecimal(2).format(Math.max(balance, 0)) })
        ]);
        tbody.appendChild(row);
    }
    tableContainer.appendChild(table);
}*/