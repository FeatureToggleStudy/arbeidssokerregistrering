import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import {
    hentStyrkkodeForSisteStillingFraAAReg,
    selectSisteStillingFraAAReg,
    State as SisteArbeidsforholdState,
    Data as SisteArbeidsforholdData,
} from '../../ducks/siste-stilling-fra-aareg';
import { AppState } from '../../reducer';
import {
    hentStillingFraPamGittStyrkkode, selectSisteStillingNavnFraPam,
    selectOversettelseAvStillingFraAAReg,
    State as OversettelseAvStillingFraAARegState,
    Data as OversettelseAvStillingFraAARegData
} from '../../ducks/oversettelse-av-stilling-fra-aareg';
import {
    ingenYrkesbakgrunn,
    selectSisteStilling,
    Stilling,
    tomStilling,
    velgSisteStilling
} from '../../ducks/siste-stilling';
import Innholdslaster from '../../komponenter/innholdslaster/innholdslaster';
import Loader from '../../komponenter/loader/loader';
import { hentOversattStillingFraAAReg } from './sporsmal/sporsmal-siste-stilling/siste-stilling-utils';
import { STATUS } from '../../ducks/api-utils';
import { selectFeatureToggles, Data as FeatureTogglesData } from '../../ducks/feature-toggles';
import FeilmeldingGenerell from '../../komponenter/feilmelding/feilmelding-generell';

interface StateProps {
    sisteStillingFraAAReg: SisteArbeidsforholdState;
    oversettelseAvStillingFraAAReg: OversettelseAvStillingFraAARegState;
    labelTilStillingFraAAReg: string;
    sisteStilling: Stilling;
    featureToggles: FeatureTogglesData;
}

interface DispatchProps {
    hentStyrkkodeForSisteStillingFraAAReg: (featureToggles: FeatureTogglesData) => Promise<void | {}>;
    hentStillingFraPamGittStyrkkode: (styrk98: string | undefined) => Promise<void | {}>;
    velgStilling: (stilling: Stilling) => void;
}

type Props = StateProps & DispatchProps;
interface State {
    stillingErSatt: {status: string};
}

class LastInnSisteStilling extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            stillingErSatt: {status: this.props.sisteStilling === tomStilling ? STATUS.NOT_STARTED : STATUS.OK}
        };
    }

    componentWillMount() {
        const velgStilling = (stilling: Stilling) => {
            this.props.velgStilling(stilling);
            this.setState({
                stillingErSatt: {status: STATUS.OK}
            });
        };

        if (this.props.sisteStillingFraAAReg.status === STATUS.NOT_STARTED) {
            this.props.hentStyrkkodeForSisteStillingFraAAReg(this.props.featureToggles)
                .then((responseSisteArbeidsforhold) => {
                    const {styrk} = responseSisteArbeidsforhold as SisteArbeidsforholdData;

                    this.props.hentStillingFraPamGittStyrkkode(styrk).then((responseOversettelseAvStillingFraAAReg) => {
                        if (styrk !== 'utenstyrkkode') {
                            velgStilling(hentOversattStillingFraAAReg(
                                responseOversettelseAvStillingFraAAReg as OversettelseAvStillingFraAARegData
                            ));
                        } else {
                            velgStilling(ingenYrkesbakgrunn);
                        }
                    });
                });
        }
    }

    render() {
        const {
            sisteStillingFraAAReg,
            oversettelseAvStillingFraAAReg,
        } = this.props;

        return (
            <Innholdslaster
                feilmeldingKomponent={<FeilmeldingGenerell />}
                avhengigheter={[sisteStillingFraAAReg, oversettelseAvStillingFraAAReg, this.state.stillingErSatt]}
                storrelse="XXL"
                loaderKomponent={<Loader/>}
            >
                {this.props.children}
            </Innholdslaster>
        );
    }
}

const mapStateToProps = (state) => ({
    sisteStillingFraAAReg: selectSisteStillingFraAAReg(state),
    oversettelseAvStillingFraAAReg: selectOversettelseAvStillingFraAAReg(state),
    labelTilStillingFraAAReg: selectSisteStillingNavnFraPam(state),
    sisteStilling: selectSisteStilling(state),
    featureToggles: selectFeatureToggles(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    hentStyrkkodeForSisteStillingFraAAReg: () => dispatch(
        hentStyrkkodeForSisteStillingFraAAReg()
    ),
    hentStillingFraPamGittStyrkkode: (styrk: string) => dispatch(hentStillingFraPamGittStyrkkode(styrk)),
    velgStilling: (stilling: Stilling) => dispatch(velgSisteStilling(stilling)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LastInnSisteStilling);
