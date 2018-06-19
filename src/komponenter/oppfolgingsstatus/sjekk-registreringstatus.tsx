import * as React from 'react';
import { connect } from 'react-redux';
import { Data as RegistreringstatusData, selectRegistreringstatus } from '../../ducks/registreringstatus';
import { AppState } from '../../reducer';
import SblRegistrering from '../../sider/sbl-registrering/sbl-registrering';
import AlleredeRegistrert from '../../sider/allerede-registrert/allerede-registrert';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface StateProps {
    registreringstatusData: RegistreringstatusData;
}

type Props = StateProps & InjectedIntlProps;

class SjekkRegistreringstatus extends React.PureComponent<Props> {
    render () {
        const {registreringstatusData, children} = this.props;
        if (registreringstatusData.underOppfolging) {
            return <AlleredeRegistrert intl={this.props.intl} />;
        } else if (!registreringstatusData.oppfyllerKrav) {
            return <SblRegistrering/>;
        } else {
            return <>{children}</>;
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    registreringstatusData: selectRegistreringstatus(state).data,
});

export default connect(mapStateToProps)(
    injectIntl(SjekkRegistreringstatus)
);
