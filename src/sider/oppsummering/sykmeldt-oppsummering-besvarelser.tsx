import * as _ from 'lodash';
import * as React from 'react';
import { AppState } from '../../reducer';
import { connect } from 'react-redux';
import OppsummeringElement from './oppsummering-element';
import { SporsmalId } from '../../ducks/svar';
import { FormattedMessage } from 'react-intl';
import * as moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import './sykmeldt-oppsummering-besvarelser.less';
import InfoViser from '../../komponenter/info-viser/info-viser';
import { hentSvar } from '../../ducks/svar-utils';
import { hentLoepConfig } from '../skjema-sykefravaer/inngangssporsmal-svar-alternativene';

const oppsummeringSvg = require('./oppsummering.svg');

interface StateProps {
    state: AppState;
}

class SykmeldtOppsummeringBesvarelser extends React.Component<StateProps> {

    render() {
        const { state } = this.props;
        const svar = state.svar;

        if (_.isEmpty(svar)) {
            return null;
        }

        const sykemeldtSidenDato = moment(state.registreringStatus.data.sykmeldtFraDato,
            'YYYY-MM-DD').format('DD.MM.YY').toString();

        const inngangsLopSvar = hentSvar(svar, SporsmalId.fremtidigSituasjon);

        const lopConfig = hentLoepConfig({}, inngangsLopSvar);

        const element = lopConfig && lopConfig({}, '').map((config) => {
            return config.elementOppsummering;
        });

        return (
            <>
            <div className="sykmeldt-oppsummering-besvarelser">
                <img
                    src={oppsummeringSvg}
                    alt="Oppsummering sjekkliste"
                    className="sykmeldt-oppsummering-besvarelser--illustrasjon"
                />

                <div className="sykmeldt-oppsummering-besvarelser--list-container">
                    <ul className="sykmeldt-oppsummering-besvarelser--list">

                        <OppsummeringElement
                            tekstId="sykmeldt-oppsummering-sykmeldt-siden"
                            values={{ dato: sykemeldtSidenDato }}
                        />

                        <OppsummeringElement
                            sporsmalId={SporsmalId.fremtidigSituasjon}
                        >
                            <strong>Fremtidig situasjon: &nbsp;</strong>
                        </OppsummeringElement>

                        {element}

                    </ul>
                </div>

                <hr className="sykmeldt-oppsummering-besvarelser--divider"/>
                <InfoViser
                    tekstId="sykmeldt-oppsummering-besvarelser-info"
                    className="sykmeldt-oppsummering-besvarelser--info-viser"
                />
            </div>
            <Normaltekst className="blokk-m sykmeldt-oppsummering-besvarelser--egress">
                <FormattedMessage id="sykmeldt-oppsummering-egress"/>
            </Normaltekst>
            </>

        );
    }

}

const mapStateToProps = (state: AppState) => ({
    state: state
});

export default connect(mapStateToProps)(
    SykmeldtOppsummeringBesvarelser
);
