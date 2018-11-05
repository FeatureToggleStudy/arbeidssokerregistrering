import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { DITT_NAV_URL } from '../../ducks/api';
import { AppState } from '../../reducer';
import { connect, Dispatch } from 'react-redux';
import { reaktiverBruker, State as ReaktiverBrukerState } from '../../ducks/reaktiverbruker';
import Loader, { loaderTittelElement } from '../../komponenter/loader/loader';
import ReaktiveringFeilhandtering from './feilhandtering/reaktivering-feilhandtering';
import Innholdslaster from '../../komponenter/innholdslaster/innholdslaster';
import KnappBase from 'nav-frontend-knapper';
import { MatchProps } from '../../utils/utils';
import { DU_ER_NA_REGISTRERT_PATH } from '../../utils/konstanter';
import {
    Data as RegistreringstatusData,
    selectRegistreringstatus
} from '../../ducks/registreringstatus';

const handinfoSvg = require('./handinfo.svg');
import Banner from '../../komponenter/banner/banner';

interface State {
    reaktivererBruker: boolean;
}

interface StateProps {
    reaktiverBrukerData: ReaktiverBrukerState;
    registreringstatusData: RegistreringstatusData;
}

interface DispatchProps {
    onReaktiverBruker: () => Promise<void | {}>;
}

type Props = RouteComponentProps<MatchProps> & StateProps & DispatchProps;

class KreverReaktivering extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            reaktivererBruker: false
        };

        this.reaktiverBrukerOnClick = this.reaktiverBrukerOnClick.bind(this);
    }

    reaktiverBrukerOnClick() {
        const { onReaktiverBruker, history } = this.props;

        this.setState({ reaktivererBruker: true });

        onReaktiverBruker()
            .then((res) => {
                if (!!res) {
                    history.push(DU_ER_NA_REGISTRERT_PATH);
                }
            });
    }

    render() {

        if (this.state.reaktivererBruker) {

            const { reaktiverBrukerData } = this.props;

            return (
                <Innholdslaster
                    feilmeldingKomponent={<ReaktiveringFeilhandtering/>}
                    avhengigheter={[reaktiverBrukerData]}
                    loaderKomponent={<Loader tittelElement={loaderTittelElement}/>}
                />
            );

        }

        return (
            <>
                <Banner/>
                <div className="limit">
                    <section className="krever-reaktivering">
                        <Innholdstittel className="krever-reaktivering__tittel">
                            <FormattedMessage id="krever-reaktivering-tittel"/>
                        </Innholdstittel>
                        <div className="krever-reaktivering__infopanel">
                            <div className="krever-reaktivering__handinfo-ikon">
                                <img src={handinfoSvg} alt="Hånd med info skilt" className="illustrasjon"/>
                            </div>
                            <div className="krever-reaktivering__tekster">
                                <Normaltekst>
                                    <FormattedMessage id="krever-reaktivering-boks-tekst"/>
                                </Normaltekst>
                            </div>
                        </div>
                        <div className="krever-reaktivering__aksjonspanel">
                            <Normaltekst>
                                <FormattedMessage id="krever-reaktivering-undertittel"/>
                            </Normaltekst>
                            <div className={'knapper-vertikalt'}>
                                <KnappBase
                                    type="hoved"
                                    onClick={this.reaktiverBrukerOnClick}
                                >
                                    <FormattedMessage id="ja"/>
                                </KnappBase>
                                <a href={DITT_NAV_URL} className="lenke-avbryt typo-element">
                                    <FormattedMessage id="avbryt-lenke"/>
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    reaktiverBrukerData: state.reaktiverBruker,
    registreringstatusData: selectRegistreringstatus(state).data,
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    onReaktiverBruker: () => dispatch(reaktiverBruker()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
    KreverReaktivering
));
