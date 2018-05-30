/*tslint:disable*/
import {mock, respondWith, delayed, lagPamjanzzRespons} from './utils';
import startRegistreringStatus from './start-registrering-status';
import innloggingsInfo from './innloggings-info';
import brukerInfo from './bruker-info';
import registrerbruker from './registrer-bruker';
import sisteStillingFraAAReg from './siste-stilling-fra-aareg';
import oversettelseAvStillingFraAAReg from './oversettelse-av-stilling-fra-aareg';

const MOCK_START_REGISRERING_STATUS = true;
const MOCK_REGISTRER_BRUKER = true;
const MOCK_BRUKER_INFO = true;
const MOCK_INNLOGGINGS_INFO = true;
const MOCK_GET_SISTE_ARBIEDSFORHOLD = true;
const MOCK_POST_SISTE_ARBIEDSFORHOLD = true;
const MOCK_GET_KODEOVERSETTING_FRA_PAMJANZZ = true;
const MOCK_STYRK08_PAMJANZZ = true;
const MOCK_SBL = true;


if (MOCK_START_REGISRERING_STATUS) {
    (mock as any).get('/veilarboppfolgingproxy/api/startregistrering', respondWith(delayed(1000, startRegistreringStatus)));
}

if (MOCK_REGISTRER_BRUKER) {
    (mock as any).post('/veilarboppfolgingproxy/api/startregistrering', respondWith(delayed(1000, registrerbruker, 500)));
}

if (MOCK_INNLOGGINGS_INFO) {
    (mock as any).get('glob:/innloggingslinje/auth*', respondWith(delayed(1000, innloggingsInfo)));
}

if (MOCK_BRUKER_INFO) {
    (mock as any).get('/veilarboppfolgingproxy/api/oppfolging/me', respondWith(delayed(1000, brukerInfo)));
}


if(MOCK_GET_SISTE_ARBIEDSFORHOLD) {
    (mock as any).get('/veilarboppfolgingproxy/api/sistearbeidsforhold', respondWith(delayed(1000, sisteStillingFraAAReg)));
}

if(MOCK_POST_SISTE_ARBIEDSFORHOLD) {
    (mock as any).post('/veilarboppfolgingproxy/api/sistearbeidsforhold', respondWith(delayed(1000, (url, config, params) => {
        return params.bodyParams;
    })));
}

if(MOCK_SBL) {
    (mock as any).post('/sbl/arbeid/opprettMinIdBruker', respondWith(delayed(2000, {}, 404)));
}

if(MOCK_GET_KODEOVERSETTING_FRA_PAMJANZZ) {
    (mock as any).get('express:/pam-janzz/rest/kryssklassifiserMedKonsept(.*)', respondWith(delayed(500, oversettelseAvStillingFraAAReg)));
}

if(MOCK_STYRK08_PAMJANZZ) {
    (mock as any).get('express:/pam-janzz/rest/typeahead/yrke-med-styrk08(.*)',
        respondWith(delayed(100, (url, config, {queryParams}) => lagPamjanzzRespons(queryParams))));
}


(mock as any).mock('*', respondWith((url: string, config: {}) => mock.realFetch.call(window, url, config)));

