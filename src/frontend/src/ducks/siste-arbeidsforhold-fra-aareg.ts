import * as Api from './api';
import { doThenDispatch, STATUS } from './api-utils';
import { AppState } from '../reducer';

export enum ActionTypes {
    SISTE_ARBEIDSFORHOLD_FRA_AAREG_PENDING = 'SISTE_ARBEIDSFORHOLD_FRA_AAREG_PENDING',
    SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK = 'SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK',
    SISTE_ARBEIDSFORHOLD_FRA_AAREG_FEILET = 'SISTE_ARBEIDSFORHOLD_FRA_AAREG_FEILET',
}

export interface Data {
    arbeidsgiver?: string;
    stilling?: string;
    styrk?: string;
    fra?: string;
    til?: string;
}

export interface State {
    data: Data;
    status: string;
}

interface Action {
    type: ActionTypes;
    data: Data;
}

const initialState = {
    data : {},
    status: STATUS.NOT_STARTED
};

export default function (state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_PENDING:
            if (state.status === STATUS.OK) {
                return { ...state, status: STATUS.RELOADING };
            }
            return { ...state, status: STATUS.PENDING };
        case ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_FEILET:
            return { ...state, status: STATUS.ERROR };
        case ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK: {
            return { ...state, status: STATUS.OK, data: action.data };
        }
        default:
            return state;
    }
}

export function hentStyrkkodeForSisteStillingFraAAReg() {
    return doThenDispatch(() => Api.hentStyrkkodeForSisteStillingFraAAReg(), {
        PENDING: ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_PENDING,
        OK : ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK,
        FEILET: ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_FEILET,
    });
}

export function lagreArbeidsforhold(data: Data) {
    return {
        data,
        type: ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK
    };
}

export function registrerSisteArbeidsforhold(data: Data) {
    return doThenDispatch(() => Api.registrerSisteArbeidsforhold(data), {
        PENDING: ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_PENDING,
        OK : ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_OK,
        FEILET: ActionTypes.SISTE_ARBEIDSFORHOLD_FRA_AAREG_FEILET,
    });
}

export function selectSisteArbeidsforhold(state: AppState): State {
    return state.sisteArbeidsforhold;
}