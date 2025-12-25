import { $, el, createHeader, fmtCurrency, $all, fmtDate } from './main.js';
import { parseInputs, monthlyRate, computePayment } from './app01.js';

export function buildApp02() {
    $('#app02').append(
        createHeader('LENING - STATUS TUSSEN 2 DATUMS'),
        createCalculator()
    );

    //overzichtInvullen();

    /*const setDatumInput = () => {
        const input = $('.datum-status');
        const today = new Date().toISOString().split('T')[0];
        if (input.value !== today) {
            input.value = today;
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    };*/
    //$('#vandaag').addEventListener('click', setDatumInput);

    const handleChangeDatum = () => {
        const gekozenDatumSpan = $all('#gekozen-datum');
        const datumInput = $('.datum-status').value;
        const gekozenDatum = new Date(datumInput);
        if (!isNaN(gekozenDatum.getTime())) {
            const formattedDate = fmtDate(gekozenDatum);
            gekozenDatumSpan.forEach(span => {
                span.textContent = formattedDate;
            });
        } else {
            gekozenDatumSpan.forEach(span => {
                span.textContent = '';
            });
        }
        $all('.uitkomst').forEach(el => el.textContent = '');
    };
    $('.datum-status').addEventListener('change', handleChangeDatum);
    $('#berekenBtn2').addEventListener('click', calculteTotals);
}

/*export function overzichtInvullen() {
    $('#bedrag').textContent = bedragElement.value ? fmtCurrency.format(bedragElement.value) : '';
    $('#pmt2').textContent = pmtElement.textContent;
    $('#rente2').textContent = renteElement.value;
    $('#interesten2').textContent = interestenElement.textContent;
    
    //const startDate = new Date(startdatumElement.value);
    if (!isNaN(startDate.getTime())) {
        $('#startDatumDisplay').textContent = fmtDate(startDate);
        const periodeMaanden = periodeElement ? parseInt(periodeElement.value) : 0;
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + periodeMaanden);
        $('#endDatumDisplay').textContent = fmtDate(endDate);
    }
    
    $('#periodeJaar2').textContent = periodeElement.value ? `${periodeElement.value} maanden` : '';
    //const startDate = new Date(startdatumElement.value);
    const today = new Date();
    const totalePeriodeMaanden = parseInt(periodeElement.value);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + totalePeriodeMaanden);
    let resterendeMaanden = 0;
    if (today < endDate) {
        resterendeMaanden = (endDate.getFullYear() - today.getFullYear()) * 12 + (endDate.getMonth() - today.getMonth());
    }   
    $('#resterendeLooptijd').textContent = resterendeMaanden ? `${resterendeMaanden} maanden` : '';
    
}*/

function calculteTotals() {
    const inputs = parseInputs();
    if (!inputs) {
        alert('Ongeldige invoer. Controleer de leninggegevens.');
        return;
    }
    const { bedrag, jkp, periode, renteType: type } = inputs;

    const startDate = new Date($('#startDatum').value);
    if (isNaN(startDate.getTime())) {
        alert('Er is geen geldige startdatum voor de lening gevonden.');
        return;
    }
    const currentDate = new Date($('.datum-status').value);
    if (isNaN(currentDate.getTime())) {
        alert('Kies een datum.');
        return;
    } else if (currentDate < startDate) {
        alert('De gekozen datum ligt voor de startdatum van de lening.');
        $all('.uitkomst').forEach(el => el.textContent = '');
        return;
    }
    
    const paymentDate = new Date(startDate);
    const maandRentePercentage = monthlyRate(jkp, type);
    const betaling = computePayment(bedrag, maandRentePercentage, periode);
    let totaalKapitaal = 0;
    let totaalRente = 0;
    const totalInterestAll = betaling * periode - bedrag;
    let restantRente = totalInterestAll;
    let maandRente = 0;

    for (let i = 1; i <= periode; i++) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
        if (paymentDate > currentDate) break;
        maandRente = (bedrag - totaalKapitaal) * maandRentePercentage;
        totaalRente += maandRente;
        restantRente -= maandRente;
        totaalKapitaal += (betaling - maandRente);
    }
    
    //const restantKapitaal = bedrag - totaalKapitaal;

    $('#totaal-kapitaal').textContent = fmtCurrency.format(totaalKapitaal);
    //$('#restant-kapitaal').textContent = fmtCurrency.format(restantKapitaal);
    $('#totaal-rente').textContent = fmtCurrency.format(totaalRente);
    //$('#restant-rente').textContent = fmtCurrency.format(Math.max(restantRente, 0));
}

function createCalculator() {
    const createBerekenButton = () => {
        return el('button', { id: 'berekenBtn2', class: 'bereken-btn', text: 'Bereken' });
    }
    return el('div', { class: 'calculator' }, [
        createOverzicht(),
        createSectie1(),
        createBerekenButton(),
        createSectie3()
        //createSectie4()
    ]);
}

function createOverzicht() {
    return el("div", { class: "overzicht" }, [
        el("h2", { text: "Leningsgegevens :", class: "overzicht-titel" }),
        el('div', { class: 'overzicht-inhoud' }, [
            el("div", { html: `
                <p> Lening bedrag:
                    <span id="bedrag-2" class="resultaat"></span>
                </p>
                <p> Maandelijkse betaling:
                    <span id="pmt-2" class="resultaat"></span>
                </p>
                <p> Maandelijkse rentevoet:
                    <span id="rente-2" class="resultaat"></span>
                </p>
                <p> Totaal te betalen interesten:
                    <span id="interesten-2" class="resultaat"></span>
                </p>
            `}),
            el("div", { html: `
                <p> Startdatum lening:
                    <span id="startDatumDisplay" class="resultaat"></span>
                </p>
                <p> Einddatum lening:
                    <span id="endDatumDisplay" class="resultaat"></span>
                </p>
                <p> Lening periode:
                    <span id="periodeJaar-2" class="resultaat"></span>
                </p>
                <p> Resterende looptijd:
                    <span id="resterendeLooptijd-2" class="resultaat"></span>
                </p>
            `})
        ])
    ]);
}

function createSectie1() {
    return el('div', { class: 'top-sectie' }, [
        el('div', { class: 'datum-sectie' }, [
            el('div', { class: 'start-datum-sectie' }, [
                el('h2', { text: 'Datum 1 :', class: 'kies-datum' }),
                el('input', { type: 'date', id:'startdatum-status', class: 'datum-status' })]),
            el('div', { class: 'eind-datum-sectie' }, [
                el('h2', { text: 'Datum 2 :', class: 'kies-datum' }),
                el('input', { type: 'date', id:'einddatum-status', class: 'datum-status' }),
                //el('button', { id: 'vandaag', class: 'vandaag-btn', text: 'vandaag' })
            ]),
        ]),
        el('div', { class: 'uitleg-sectie' }, [
        el('p', { class: 'uitleg-tekst', text: 'Bereken het afbetaalde kapitaal en de betaalde rente tussen twee datums op basis van de ingevoerde leninggegevens.' }),
        el('p', { class: 'uitleg-tekst', html: `De berekening is gebaseerd op de ingevoerde leninggegevens in de <strong>Lening Calculator 1</strong> sectie.` })
        ])
    ]);
}

function createSectie3() {
    return el('div', { class: 'sectie-wrapper' }, [
        el('div', { class: 'kapitaal-groep' , html:`
            <div class="sectie-header">
                <p> Afbetaald kapitaal: 
                    <span id="totaal-kapitaal" class="uitkomst"></span>
                </p>
            </div>
            `
        }),
        el('div', { class: 'rente-groep' , html:`
            <div class="sectie-header">
                <p> Afbetaalde Rente: 
                    <span id="totaal-rente" class="uitkomst"></span>
                </p>
            </div>
            `
        }),
    ]);
}
