import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import antallSporsmal from '../sporsmal/alle-sporsmal';
import { Systemtittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { endreSvarAction } from '../ducks/svar';
import { AppState } from '../reducer';
import Alternativ, { EndreSvar } from './alternativ';
import { RouteComponentProps } from 'react-router';
import KnappNeste from '../komponenter/knapp-neste';
import { configSelvgaende, erSelvgaende, erSvarAlternativMerEnnTo } from './skjema-utils';
import KnappAvbryt from './knapp-avbryt';
import { AVBRYT_PATH, OPPSUMMERING_PATH, SBLREG_PATH, SKJEMA_PATH } from '../utils/konstanter';

interface SkjemaProps {
    id: string;
    resetSvar: () => void;
}

export interface MatchProps {
    id: string;
}

interface StateProps {
    erSelvgaendeBruker: () => boolean;
    erAlleSpmBesvart: () => boolean;
    sporsmalErBesvart: (sporsmalId: string) => boolean;
    hentAvgittSvarId: (sporsmalId: string) => string;
}

interface DispatchProps {
    endreSvar: EndreSvar;
}

type Props = SkjemaProps & InjectedIntlProps & DispatchProps & StateProps & RouteComponentProps<MatchProps>;

function Skjema({
                    match,
                    history,
                    intl,
                    endreSvar,
                    sporsmalErBesvart,
                    erAlleSpmBesvart,
                    erSelvgaendeBruker,
                    hentAvgittSvarId
                }: Props) {

    const spmId = match.params.id;

    if (parseInt(spmId, 10) > antallSporsmal.length) {
        history.push(`${SKJEMA_PATH}/1`);
        return null;
    }

    const disableKnappNeste = !sporsmalErBesvart(spmId);
    const disableKnappFullfor = erAlleSpmBesvart();

    return (
        <div>
            <div className="blokk panel-skjema-wrapper">
                <Systemtittel tag="h1" className="spm-tittel">
                    {intl.messages[`sporsmal-${spmId}-tittel`]}
                </Systemtittel>
                <Panel className="panel-skjema">
                    <form className={`${erSvarAlternativMerEnnTo(spmId)} form-skjema`}>
                        {Array.from(Array(antallSporsmal[parseInt(spmId, 10) - 1]).keys())
                            .map(i => i + 1)
                            .map((key) => <Alternativ
                                sporsmalId={spmId}
                                endreSvar={endreSvar}
                                key={key}
                                alternativId={key.toString()}
                                tekstId={`sporsmal-${spmId}-alternativ-${key}`}
                                checked={key === parseInt(hentAvgittSvarId(spmId), 10)}
                                intl={intl}
                            />)}
                    </form>
                </Panel>
            </div>

            <div className="panel-blokk__knapperad">
                <KnappAvbryt
                    classname="mmr"
                    onClick={(() => {
                        history.push(`${AVBRYT_PATH}`);
                    })}
                />
                {
                    parseInt(spmId, 10) === antallSporsmal.length ?
                        <KnappNeste
                            disabled={disableKnappFullfor}
                            onClick={() => {
                                if (erSelvgaendeBruker()) {
                                    history.push(`${OPPSUMMERING_PATH}`);
                                } else {
                                    history.push(`${SBLREG_PATH}`);
                                }
                            }}
                        />
                        :
                        <KnappNeste
                            disabled={disableKnappNeste}
                            onClick={(() => {
                                history.push(`${SKJEMA_PATH}/${(parseInt(spmId, 10) + 1)}`);
                            })}
                        />
                }
            </div>
        </div>
    );
}

const mapStateToProps = (state: AppState): StateProps => ({
    sporsmalErBesvart: (sporsmalId) => !!state.svar[sporsmalId],
    hentAvgittSvarId: (sporsmalId) => state.svar[sporsmalId],
    erAlleSpmBesvart: () => Object.keys(state.svar).filter(key => state.svar[key] === undefined).length !== 0,
    erSelvgaendeBruker: () => erSelvgaende(state.svar, configSelvgaende)
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    endreSvar: (sporsmalId, alternativId) => dispatch(endreSvarAction(sporsmalId, alternativId)),
});

export default connect(mapStateToProps, mapDispatchToProps)
(injectIntl(Skjema)
);