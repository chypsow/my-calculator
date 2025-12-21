import { $, el, showApp, fmtCurrency } from './main.js';
import { createHeader, parseInputs, monthlyRate, computePayment } from './lening.js';

export function renderApp02() {
    showApp(2);
    const root = $('#app02');
    if (root.innerHTML.trim() !== "") return; // Prevent re-initialization
    root.append(
        createHeader('LENING STATUS'),
        createCalculator()
    );

    $('#vandaag').addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        $('#input1').value = today;
    });

    $('#berekenBtn').addEventListener('click', () => {
        calculteTotals();
    });
}

function calculteTotals() {
    const inputs = parseInputs();
    if (!inputs) return;
    const { bedrag, jkp, periode, renteType: type } = inputs;
    const currentDate = new Date($('#input1').value);
    if (isNaN(currentDate.getTime())) return;
    const startDate = new Date($('#startDatum').value);
    if (isNaN(startDate.getTime())) return;

    const paymentDate = new Date(startDate);
    const maandRentePercentage = monthlyRate(jkp, type);
    const betaling = computePayment(bedrag, maandRentePercentage, periode);
    let totaalKapitaal = 0;
    let totaalRente = 0;
    const totalInterestAll = betaling * periode - bedrag;
    let restantRente = totalInterestAll;
    //console.log('restantRente init: ' + restantRente);
    let maandRente = 0;

    for (let i = 1; i <= periode; i++) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
        if (paymentDate > currentDate) break;
        maandRente = (bedrag - totaalKapitaal) * maandRentePercentage;
        totaalRente += maandRente;
        restantRente -= maandRente;
        totaalKapitaal += (betaling - maandRente);
    }
    
    const restantKapitaal = bedrag - totaalKapitaal;
    //const restantPeriode = periode - Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));

    $('#totaal-kapitaal').value = fmtCurrency.format(totaalKapitaal);
    $('#restant-kapitaal').value = fmtCurrency.format(restantKapitaal);
    $('#totaal-rente').value = fmtCurrency.format(totaalRente);
    $('#restant-rente').value = fmtCurrency.format(Math.max(restantRente, 0));
}

function createCalculator() {
    // Implementation for calculator 1 goes here
    return el('div', { class: 'calculator' }, [
        createSectie1(),
        createSectie2(),
        createSectie3(),
        createSectie4()
    ]);
}
function createSectie1() {
    return el('div', { class: 'sectie1' }, [
        el('div', { class: 'top-sectie' }, [
            el('label', { text: 'Datum:', class: 'label-status', for: 'input1' }, [
                el('input', { type: 'date', id: 'input1', class: 'input-status' })
            ]),
            el('button', { id: 'vandaag', class: 'vandaag-btn', text: 'vandaag' })
            //el('button', { id: 'berekenBtn', class: 'bereken-btn', text: 'Bereken' })
        ]),
        // Add more elements as needed
    ]);
}
function createSectie2() {
    return el('div', { class: 'sectie2' }, [
        el('button', { id: 'berekenBtn', class: 'bereken-btn', text: 'Bereken' })
           
    ]);
}
function createSectie3() {
    return el('div', { class: 'sectie3' }, [
        el('div', { class: 'bottom-sectie' , html: 
            `<div class="kapitaal-groep"> 
                <label> Totaal afbetaald kapitaal:
                    <input type="text" id="totaal-kapitaal" disabled>
                </label>
                <label> Totaal restant kapitaal:
                    <input type="text" id="restant-kapitaal" disabled>
                </label>
            </div>`
            
        }),
    ]);
}
function createSectie4() {
    return el('div', { class: 'sectie4' }, [
        el('div', { class: 'bottom-sectie' , html:
            `<div class="rente-groep">
                <label> Totaal afbetaalde rente:
                    <input type="text" id="totaal-rente" disabled>
                </label>
                <label> Totaal restant rente:
                    <input type="text" id="restant-rente" disabled>
                </label>
            </div>`
        }),
    ]);
}