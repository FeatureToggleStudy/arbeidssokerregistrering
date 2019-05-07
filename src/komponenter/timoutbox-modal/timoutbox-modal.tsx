import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import NavFrontendModal from 'nav-frontend-modal';
import { connect, Dispatch } from 'react-redux';
import { AppState } from '../../reducer';
import {
    hentAuthExpiration,
    selectAuthExpiration
} from '../../ducks/auth-expiration';
import './timoutbox-modal.less';
import * as moment from 'moment';
import StartPaaNytt from './start-paa-nytt';
import { frontendLogger } from '../../metrikker/metrics-utils';
import { Data as AuthExpiration } from '../../ducks/auth-expiration';

const infoSvg = require('./info.svg');

interface EgenState {
    manueltLukket: boolean;
}

interface DispatchProps {
    hentAuthExpiration: () => Promise<void | {}>;
}

interface StateProps {
    expirationTime?: string;
}

type AllProps = StateProps & DispatchProps;

class TimoutboxModal extends React.Component<AllProps, EgenState> {

    private timeout;

    componentDidMount() {
        this.props.hentAuthExpiration()
            .then((authExp: AuthExpiration) => {
                const { expirationTime } = authExp;

                if (!this.timeout && expirationTime) {
                    const expirationInMillis = this.visningsTidspunkt().diff(
                        moment(),
                        'ms'
                    );
                    this.timeout = setTimeout(() => {
                        frontendLogger('timeoutbox.sesjon.utgatt');
                        this.forceUpdate();
                    }, expirationInMillis + 100);
                }
            });
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    visningsTidspunkt() {
        return moment(this.props.expirationTime).subtract(5, 'minutes');
    }

    skalViseModal() {
        return moment().isAfter(this.visningsTidspunkt());
    }

    render() {
        const skalVise = this.skalViseModal();
        const utlopsTidspunkt = this.props.expirationTime;
        if (!utlopsTidspunkt) {
            return null;
        }
        
        return (
            <NavFrontendModal
                isOpen={skalVise}
                contentLabel="Blir logget ut"
                className="timeoutbox-modal"
                shouldCloseOnOverlayClick={false}
                closeButton={false}
                onRequestClose={() => false}
            >
                <Veilederpanel
                    type="plakat"
                    kompakt={true}
                    svg={<img
                        src={infoSvg}
                        className="timeoutbox-modal__illustrasjon"
                    />}
                >
                    <div className="timeoutbox-nedtelling">
                        <StartPaaNytt/>
                    </div>
                </Veilederpanel>
            </NavFrontendModal>
        );
    }

}

const mapStateToProps = (state: AppState): StateProps => ({
    expirationTime: selectAuthExpiration(state).data.expirationTime
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    hentAuthExpiration: () => dispatch(hentAuthExpiration()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimoutboxModal);
