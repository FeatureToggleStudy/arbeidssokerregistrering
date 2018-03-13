import { fetchToJson, fetchWithTimeout } from './api-utils';
import { Data as SisteArbeidsforholdData } from './siste-arbeidsforhold';
import { Data as RegistrerBrukerData } from './registrerbruker';

export const INNLOGGINGSINFO_URL = '/innloggingslinje/auth';
export const SBLARBEID_URL = '/sbl/nav_security_check?goto=/sbl/arbeid/endreCv';
export const DITTNAV_URL = '/dittnav';
export const MELDEKORT_URL = '/meldekort/genereltommeldekort';
export const VEIENTILARBEID_URL = '/veientilarbeid';
export const VEIENTILARBEID_MED_OVERLAY_URL = '/veientilarbeid/?visOverlay=true';
export const ARBEIDSSOKERREGISTRERING_START = '/arbeidssokerregistrering/start';
export const VEILARBSTEPUP = `/veilarbstepup/niva/4?url=${ARBEIDSSOKERREGISTRERING_START}`;
export const SBLARBEID_OPPRETT_MIN_ID_URL = '/sbl/arbeid/opprettMinIdBruker';

const VEILARBOPPFOLGINGPROXY_URL = '/veilarboppfolgingproxy/api';

export const getCookie = name => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};
function getHeaders() {
    return new Headers({
        'Content-Type': 'application/json',
        'NAV_CSRF_PROTECTION': getCookie('NAV_CSRF_PROTECTION'), // eslint-disable-line quote-props
    });
}

const MED_CREDENTIALS = {
    credentials: ('same-origin' as RequestCredentials)
};

export function hentRegistreringStatus() {
    return fetchToJson({
        url: `${VEILARBOPPFOLGINGPROXY_URL}/startregistrering`,
        config: MED_CREDENTIALS});
}

export function registrerBruker(data: RegistrerBrukerData) {
    return fetchToJson({
        url: `${VEILARBOPPFOLGINGPROXY_URL}/startregistrering`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
            method: 'post',
            body: JSON.stringify(data)}
    });
}

const sblOpprettMinIdConfig = {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {'pragma': 'no-cache', 'cache-control': 'no-cache'},
    redirect: 'manual'
};

export function registrerBrukerSBLArbeid(timeoutMillis?: number) {
    return timeoutMillis ?
        fetchWithTimeout(SBLARBEID_OPPRETT_MIN_ID_URL, timeoutMillis, (sblOpprettMinIdConfig as RequestInit)) :
        fetch(SBLARBEID_OPPRETT_MIN_ID_URL, (sblOpprettMinIdConfig as RequestInit));
}

export function hentInnloggingsInfo() {
    return fetchToJson({
        url: `${INNLOGGINGSINFO_URL}?randomness=${Math.random()}`,
        config: MED_CREDENTIALS
    });
}

export function hentSisteArbeidsforhold() {
    return fetchToJson({
        url: `${VEILARBOPPFOLGINGPROXY_URL}/sistearbeidsforhold`,
        config: MED_CREDENTIALS,
        recoverWith: () => ({arbeidsgiver: null, stilling: null, fra: null, til: null})
    });
}

export function registrerSisteArbeidsforhold(data: SisteArbeidsforholdData) {
    return fetchToJson({
        url: `${VEILARBOPPFOLGINGPROXY_URL}/sistearbeidsforhold`,
        config: { ...MED_CREDENTIALS, method: 'post', body: JSON.stringify(data)}
    });
}