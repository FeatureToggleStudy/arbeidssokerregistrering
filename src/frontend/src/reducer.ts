import { combineReducers } from 'redux';
import svar, { SvarState } from './ducks/svar';
import registreringStatus, { RegStatusState } from './ducks/hentRegistreringStatus';

export interface AppState {
    svar: SvarState;
    registreringStatus: RegStatusState;
}

export default combineReducers<AppState>({
    svar,
    registreringStatus
});