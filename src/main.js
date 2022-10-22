import IMask from 'imask';
import './css/index.css';

const ccBgColor01 = document.querySelector(
    '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColor02 = document.querySelector(
    '.cc-bg svg > g g:nth-child(2) path'
);
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const setCardType = (type) => {
    const colors = {
        visa: ['#436d99', '#2d57f2'],
        mastercard: ['#df6f29', '#c69347'],
        default: ['black', 'gray'],
    };

    ccBgColor01.setAttribute('fill', colors[type][0]);
    ccBgColor02.setAttribute('fill', colors[type][1]);
    ccLogo.setAttribute('src', `cc-${type}.svg`);
};

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
    mask: '0000',
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
    },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardtype: 'visa',
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: 'mastercard',
        },
        {
            mask: '0000 0000 0000 0000',
            cardtype: 'default',
        },
    ],
    dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => {
            return number.match(regex);
        });

        return foundMask;
    },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', (e) => {
    alert('Cartão adicionado!');
});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', (event) => {
    const ccHolder = document.querySelector('.cc-holder .value');
    ccHolder.innerText =
        event.target.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value;
});

const updateSecurityCode = (code) => {
    const ccSecurity = document.querySelector('.cc-security .value');
    ccSecurity.innerText = code.length === 0 ? '123' : code;
};

securityCodeMasked.on('accept', () => {
    updateSecurityCode(securityCodeMasked.value);
});

const updateCardNumber = (number) => {
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number;
};

cardNumberMasked.on('accept', () => {
    setCardType(cardNumberMasked.masked.currentMask.cardtype);
    updateCardNumber(cardNumberMasked.value);
});

const updateExpirationDate = (date) => {
    const ccExpiration = document.querySelector('.cc-expiration .value');
    ccExpiration.innerHTML = date.length === 0 ? '01/32' : date;
};

expirationDateMasked.on('accept', () => {
    updateExpirationDate(expirationDateMasked._value);
});
