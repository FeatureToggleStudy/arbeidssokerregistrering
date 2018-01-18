import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { hentRegistreringStatus } from '../ducks/hentRegistreringStatus';
import Innholdslaster from '../innholdslaster/innholdslaster';
import { RegStatusState } from '../ducks/hentRegistreringStatus';
import RegistreringStatus from '../ducks/registrering-status-modell';
import { AppState } from '../reducer';
import OppfolgingsstatusFeilmelding from './oppfolgingsstatus-feilmelding';
import SblRegistrering from '../oppsummering/sbl-registrering';
import { VEIENTILARBEID_URL } from '../ducks/api';
import { getIntlMessage } from '../utils/utils';

interface StateProps {
    registreringStatus: RegStatusState;
}

interface DispatchProps {
    hentRegistrering: () => void;
}

type AppWrapperProps = StateProps & DispatchProps & InjectedIntlProps;

function redirectOrRenderChildren(data: RegistreringStatus,
                                  children: React.ReactNode | React.ReactChild) {
    if (data.underOppfolging) {
        document.location.href = VEIENTILARBEID_URL;
        return null;
    } else if (!data.oppfyllerKrav) {
        return <SblRegistrering/>;
    } else {
        return children;
    }
}

class SjekkOppfolgingsstatusWrapper extends React.Component<AppWrapperProps> {
    componentWillMount() {
        this.props.hentRegistrering();
    }

    render() {
        const {registreringStatus, children, intl } = this.props;
        return (
            <Innholdslaster
                avhengigheter={[registreringStatus]}
                feilmeldingKomponent={
                    <OppfolgingsstatusFeilmelding
                        feilmelding={getIntlMessage(intl.messages, 'feil-i-systemene-beskrivelse')}
                    />
                }
                storrelse="XXL"
            >
                {() => redirectOrRenderChildren(
                    registreringStatus.data,
                    children
                )}
            </Innholdslaster>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    registreringStatus: state.registreringStatus
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    hentRegistrering: () => dispatch(hentRegistreringStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(SjekkOppfolgingsstatusWrapper)
);