import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import {
    hentStyrkkodeForSisteStillingFraAAReg,
    selectSisteArbeidsforhold,
    State as SisteArbeidsforholdState,
} from '../../ducks/siste-arbeidsforhold-fra-aareg';
import Innholdslaster from '../../komponenter/innholdslaster/innholdslaster';
import Feilmelding from '../../komponenter/initialdata/feilmelding';
import { AppState } from '../../reducer';
import { MatchProps } from '../../utils/utils';
import { RouteComponentProps } from 'react-router';
import { STATUS } from '../../ducks/api-utils';
import {
    velgStilling,
    hentStillingFraPamGittStyrkkode, selectSisteStillingNavnFraPam,
    selectStillingFraPam,
    State as StillingFraPamState
} from '../../ducks/stilling-fra-pam';
import KnappNeste from '../../komponenter/knapper/knapp-neste';
import EkspanderbartInfo from '../../komponenter/ekspanderbartinfo/ekspanderbartInfo';
import { AVBRYT_PATH, OPPSUMMERING_PATH } from '../../utils/konstanter';
import Tilbakeknapp from '../../komponenter/knapper/tilbakeknapp';
import PanelBlokkGruppe from '../../komponenter/panel-blokk/panel-blokk-gruppe';
import PanelBlokk from '../../komponenter/panel-blokk/panel-blokk';
import Knappervertikalt from '../../komponenter/knapper/knapper-vertikalt';
import { Normaltekst } from 'nav-frontend-typografi';
import LenkeAvbryt from '../../komponenter/knapper/lenke-avbryt';
import SokeInput from './sokeinput';

interface StateProps {
    sisteArbeidsforhold: SisteArbeidsforholdState;
    stillingFraPam: StillingFraPamState;
    stillingNavn: string;
}

interface DispatchProps {
    hentStyrkkodeForSisteStillingFraAAReg: () => Promise<void | {}>;
    hentStillingFraPamGittStyrkkode: (styrk: string | undefined) => void;
    velgStilling: (label: string, kode: string) => void;
}

type Props = StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps<MatchProps>;

class SisteArbeidsforhold extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.onAvbryt = this.onAvbryt.bind(this);
        this.onTilbake = this.onTilbake.bind(this);
        this.onNeste = this.onNeste.bind(this);
    }

    componentWillMount() {
        if (this.props.sisteArbeidsforhold.status === STATUS.NOT_STARTED) {
            this.props.hentStyrkkodeForSisteStillingFraAAReg()
                .then(() => {
                    const {styrk} = this.props.sisteArbeidsforhold.data;
                    this.props.hentStillingFraPamGittStyrkkode(styrk);
                });
        }
    }

    onAvbryt() {
        this.props.history.push(AVBRYT_PATH);
    }

    onTilbake() {
        this.props.history.goBack();
    }

    onNeste() {
        this.props.history.push(OPPSUMMERING_PATH);
    }

    render() {
        const {sisteArbeidsforhold, stillingFraPam, stillingNavn, intl} = this.props;

        return (
            <Innholdslaster
                feilmeldingKomponent={<Feilmelding intl={intl} id="feil-i-systemene-beskrivelse"/>}
                avhengigheter={[sisteArbeidsforhold, stillingFraPam]}
                storrelse="XXL"
            >
                <PanelBlokkGruppe className="blokk-xs">
                    <Tilbakeknapp onClick={this.onTilbake}/>
                    <PanelBlokk
                        tittelId="siste-arbeidsforhold.tittel"
                        tittelCssNavnVariant="transparent-variant"
                        beskrivelseId="siste-arbeidsforhold.ingress"
                        cssVariant="padding-vertikalt-xsmall"
                    />
                    <PanelBlokk cssVariant="transparent-variant padding-vertikalt-xsmall ">
                        <SokeInput feltNavn={stillingNavn} onChange={this.props.velgStilling}/>
                        <EkspanderbartInfo tittelId="siste-arbeidsforhold.info.tittel" className="blokk">
                            <Normaltekst>
                                <FormattedMessage id="siste-arbeidsforhold.info.tekst"/>
                            </Normaltekst>
                        </EkspanderbartInfo>
                        <Knappervertikalt>
                            <KnappNeste onClick={this.onNeste}/>
                            <LenkeAvbryt />
                        </Knappervertikalt>
                    </PanelBlokk>
                </PanelBlokkGruppe>

            </Innholdslaster>
        );
        /*tslint:disable:no-console*/
    }
}

const mapStateToProps = (state) => ({
    sisteArbeidsforhold: selectSisteArbeidsforhold(state),
    stillingFraPam: selectStillingFraPam(state),
    stillingNavn: selectSisteStillingNavnFraPam(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    hentStyrkkodeForSisteStillingFraAAReg: () => dispatch(hentStyrkkodeForSisteStillingFraAAReg()),
    hentStillingFraPamGittStyrkkode: (styrk: string) => dispatch(hentStillingFraPamGittStyrkkode(styrk)),
    velgStilling: (label: string, kode: string) => dispatch(velgStilling(label, kode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(SisteArbeidsforhold)
);