import { combineReducers } from 'redux';
import svar, { SvarState } from './ducks/svar';
import registreringStatus, { RegStatusState } from './ducks/hentRegistreringStatus';
import innloggingsInfo, { InnloggingsInfoState } from './ducks/hentInnloggingsInfo';

export interface AppState {
    svar: SvarState;
    registreringStatus: RegStatusState;
    innloggingsInfo: InnloggingsInfoState;
}

export default combineReducers<AppState>({
    svar,
    registreringStatus,
    innloggingsInfo,
});