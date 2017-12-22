import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import antallSporsmal from '../sporsmal/alle-sporsmal';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { endreSvarAction } from '../ducks/svar';
import { AppState } from '../reducer';
import Alternativ, { EndreSvar } from './alternativ';
import { RouteComponentProps } from 'react-router';
import KnappNeste from './knapp-neste';
import KnappFullfor from './knapp-fullfor';
import { configSpmPrSide } from './skjema-utils';

interface SkjemaProps {
    id: string;
    resetSvar: () => void;
}

export interface MatchProps {
    id: string;
}

interface StateProps {
    sporsmalErBesvart: (sporsmalId: string) => boolean;
    hentAvgittSvarId: (sporsmalId: string) => string;
}

interface DispatchProps {
    endreSvar: EndreSvar;
}

type Props = SkjemaProps & InjectedIntlProps & DispatchProps & StateProps & RouteComponentProps<MatchProps>;

function Skjema({match, history, intl, endreSvar, sporsmalErBesvart, hentAvgittSvarId}: Props) {
    const sideId = match.params.id;
    // const antallAlternativer = antallSporsmal[parseInt(sporsmalId, 10) - 1];
    // const tittelId = `sporsmal-${sporsmalId}-tittel`;
    // const avgittSvarId = parseInt(hentAvgittSvarId(sideId), 10);

    // todo
    // test send tilbake til førsteside, dersom sideurl ikke finnes
    // test fullforknap disable frem til alle spm er besvart

    const spmListePaSiden = configSpmPrSide[sideId];

    let disbl = true;
    spmListePaSiden.map((spmId: string) => {
        disbl = !sporsmalErBesvart(spmId);
    });

    return (
        <div>
            {
                spmListePaSiden
                    .map((spmId: string) => (
                        <div>
                            <Undertittel className="blokk-xxs">
                                {intl.messages[`sporsmal-${spmId}-tittel`]}
                            </Undertittel>
                            <Panel className="blokk-s">
                                <form >
                                    {Array.from(Array(antallSporsmal[parseInt(spmId, 10) - 1]).keys())
                                        .map(i => i + 1)
                                        .map((key) => <Alternativ
                                            sporsmalId={spmId}
                                            endreSvar={endreSvar}
                                            key={key}
                                            alternativId={key.toString()}
                                            tekstId={`sporsmal-${sideId}-alternativ-${key}`}
                                            checked={key === parseInt(hentAvgittSvarId(spmId), 10)}
                                            intl={intl}
                                        />)}
                                </form>
                            </Panel>
                        </div>
                    ))
            }

            <div className="skjema-knapper">
                {
                    parseInt(sideId, 10) === Object.keys(configSpmPrSide).length ?
                        <KnappFullfor
                            disabled={disbl}
                            onClick={() => history.push('/oppsummering')}
                        />
                        :
                        <KnappNeste
                            disabled={disbl}
                            onClick={(() => {
                                history.push(`/skjema/${(parseInt(sideId, 10) + 1)}`);
                            })}
                        />
                }
            </div>
        </div>
    );
}

const mapStateToProps = (state: AppState): StateProps => ({
    sporsmalErBesvart: (sporsmalId) => !!state.svar[sporsmalId],
    hentAvgittSvarId: (sporsmalId) => state.svar[sporsmalId]
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    endreSvar: (sporsmalId, alternativId) => dispatch(endreSvarAction(sporsmalId, alternativId)),
});

export default connect(mapStateToProps, mapDispatchToProps)
(injectIntl(Skjema)
);