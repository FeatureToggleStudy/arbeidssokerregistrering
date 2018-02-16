/*tslint:disable*/
import {mock, respondWith, delayed } from './utils';
import startRegistreringStatus from './start-registrering-status';
import innloggingsInfo from './innloggings-info';
import registrerbruker from './registrer-bruker';
import sisteArbeidsforhold from './siste-arbeidsforhold';

const MOCK_START_REGISRERING_STATUS = false;
const MOCK_REGISTRER_BRUKER = false;
const MOCK_INNLOGGINGS_INFO = true;
const MOCK_HENT_KRR_STATUS = true;
const MOCK_GET_SISTE_ARBIEDSFORHOLD = true;
const MOCK_POST_SISTE_ARBIEDSFORHOLD = true;


if (MOCK_START_REGISRERING_STATUS) {
    (mock as any).get('/veilarboppfolgingproxy/api/startregistrering', respondWith(delayed(1000, startRegistreringStatus)));
}

if (MOCK_REGISTRER_BRUKER) {
    (mock as any).post('/veilarboppfolgingproxy/api/startregistrering', respondWith(delayed(1000, registrerbruker)));
}

if (MOCK_INNLOGGINGS_INFO) {
    (mock as any).get('glob:/innloggingslinje/auth*', respondWith(delayed(1000, innloggingsInfo)));
}

if(MOCK_HENT_KRR_STATUS) {
    (mock as any).get('/veilarboppfolgingproxy/api/krr', respondWith(delayed(1000, { reservertIKrr: false})));
}

if(MOCK_GET_SISTE_ARBIEDSFORHOLD) {
    (mock as any).get('/veilarboppfolgingproxy/api/sistearbeidsforhold', respondWith(delayed(1000, sisteArbeidsforhold)));
}

if(MOCK_POST_SISTE_ARBIEDSFORHOLD) {
    (mock as any).post('/veilarboppfolgingproxy/api/sistearbeidsforhold', respondWith(delayed(1000, (url, config, params) => {
        return params.bodyParams;
    })));
}


(mock as any).mock('*', respondWith((url: string, config: {}) => mock.realFetch.call(window, url, config)));

