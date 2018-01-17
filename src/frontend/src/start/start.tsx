import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { MatchProps } from '../skjema/skjema';
import PanelBlokk from '../felles/panel-blokk';
import PanelBlokkGruppe from '../felles/panel-blokk-gruppe';
import KnappNeste from '../komponenter/knapp-neste';
import { InnloggingsInfoState } from '../ducks/hentInnloggingsInfo';
import { AppState } from '../reducer';
import { hentFornavn } from '../utils/utils';

interface StateProps {
    innloggingsInfo: InnloggingsInfoState;
}

type StartProps = StateProps & null;

export class Start extends React.Component<RouteComponentProps<MatchProps> & StartProps> {
    render () {
        const { history, innloggingsInfo } = this.props;
        const { name } = innloggingsInfo.data;
        return (
            <PanelBlokkGruppe
                knappAksjoner={
                    [
                        <Knapp
                            key="1"
                            type="standard"
                            className="knapp"
                            onClick={() => history.push('/avbryt')}
                        >
                            <Normaltekst>
                                <FormattedMessage id="knapp-avbryt"/>
                            </Normaltekst>
                        </Knapp>,
                        <KnappNeste
                            key="2"
                            className="mml"
                            onClick={(() => {
                                history.push('/skjema/1');
                            })}
                        />
                    ]
                }
            >
                <PanelBlokk
                    tittelId="overskrift-start"
                    tittelVerdier={{fornavn: hentFornavn(name)}}
                    tittelCssNavnVariant="bla-variant"
                    beskrivelseId="beskrivelse-start"
                />
            </PanelBlokkGruppe>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    innloggingsInfo: state.innloggingsInfo
});

export default connect(mapStateToProps, null)(Start);
