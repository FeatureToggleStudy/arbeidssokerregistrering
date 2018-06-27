import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import KnappBase from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { selectBrukersNavn, State as BrukersNavnState } from '../../ducks/brukers-navn';
import { hentAlder, MatchProps } from '../../utils/utils';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../../reducer';
import { hentFornavn } from '../../utils/utils';
import { FULLFOR_PATH, SKJEMA_PATH } from '../../utils/konstanter';
import LenkeAvbryt from '../../komponenter/knapper/lenke-avbryt';
import { INGEN_SVAR } from '../skjema/skjema-container';

const oppsummeringSvg = require('./oppsummering.svg');

interface StateProps {
    brukersNavn: BrukersNavnState;
    state: AppState;
}

type EgenProps = StateProps;

const oppsummeringBesvarelser = (state: AppState) => {
    const {brukersFnr} = state, {data} = brukersFnr, personId = data.id;
    const svar = state.svar;

    if (_.isEmpty(svar)) {
        return null;
    }

    const alderElement = _.isEmpty(data) ? (null) : (
            <li className="typo-normal">
                <FormattedMessage
                    id="oppsummering-alder"
                    values={{alder: personId && hentAlder(personId)}}
                />
            </li>
        );

    const registreringStatus = state.registreringStatus.data;
    const jobbetSeksAvTolvSisteManederTekstId = registreringStatus.jobbetSeksAvTolvSisteManeder
        ? 'oppsummering-arbeidserfaring-1'
        : 'oppsummering-arbeidserfaring-2';
    const registrertNavSisteToArTekstId = registreringStatus.registrertNavSisteToAr
        ? 'oppsummering-inaktivitet-1'
        : 'oppsummering-inaktivitet-2';

    const dinSituasjon = svar['din-situasjon'] === INGEN_SVAR ? (null) : (
        <li className="typo-normal">
            <FormattedMessage id={`oppsummering-din-situasjon`}/> &nbsp;
            <FormattedMessage id={`oppsummering-din-situasjon-svar-${svar['din-situasjon']}`}/>
        </li>
    );

    const sisteStilling = svar['siste-stilling'] === INGEN_SVAR ? (null) : (
        <li className="typo-normal">
            Siste stilling:&nbsp;{
            svar['siste-stilling'] === 1
                ? state.sisteStilling.data.stilling.label
                : <FormattedMessage
                    id={`oppsummering-sistestilling-svar-${svar['siste-stilling']}`}
                />
        }
        </li>
    );

    const utdanningBestatt = svar.utdanningbestatt === INGEN_SVAR ? (null) : (
        <li className="typo-normal">
            <FormattedMessage id={`oppsummering-utdanningbestatt-svar-${svar.utdanningbestatt}`}/>
        </li>
    );

    const utdanningGodkjent = svar.utdanninggodkjent === INGEN_SVAR ? (null) : (
        <li className="typo-normal">
            <FormattedMessage id={`oppsummering-utdanninggodkjent-svar-${svar.utdanningbestatt}`}/>
        </li>
    );

    return (
        <div className="oppsummering-besvarelser">
            <img
                src={oppsummeringSvg}
                alt="Oppsummering sjekkliste"
                className="oppsummering-besvarelser__illustrasjon"
            />
            <ul className="oppsummering-besvarelser__list">
                {alderElement}
                <li className="typo-normal">
                    <FormattedMessage id={jobbetSeksAvTolvSisteManederTekstId}/>
                </li>
                <li className="typo-normal">
                    <FormattedMessage id={registrertNavSisteToArTekstId}/>
                </li>
                {dinSituasjon}
                {sisteStilling}
                <li className="typo-normal">
                    Høyeste fullførte utdanning:&nbsp;
                    <FormattedMessage id={`utdanning-alternativ-${svar.utdanning}`}/>
                </li>
                {utdanningBestatt}
                {utdanningGodkjent}
                <li className="typo-normal">
                    <FormattedMessage id={`oppsummering-helsehinder-svar-${svar.helsehinder}`}/>
                </li>
                <li className="typo-normal">
                    <FormattedMessage id={`oppsummering-andreforhold-svar-${svar.andreforhold}`}/>
                </li>
            </ul>
        </div>
    );
};

class Oppsummering extends React.Component<RouteComponentProps<MatchProps> & EgenProps> {

    componentWillMount() {
        const {state, history} = this.props;
        if (_.isEmpty(state.svar)) {
            history.push(`${SKJEMA_PATH}/0`);
        }
    }

    render() {
        const {history, brukersNavn, state} = this.props;
        const {name} = brukersNavn.data;
        return (
            <section className="oppsummering">
                <div className="limit">
                    <Innholdstittel tag="h1" className="oppsummering-tittel">
                        <FormattedMessage id="oppsummering-tittel" values={{fornavn: hentFornavn(name)}}/>
                    </Innholdstittel>
                    <Normaltekst className="oppsummering-ingress">
                        <FormattedMessage id="oppsummering-ingress"/>
                    </Normaltekst>

                    {oppsummeringBesvarelser(state)}

                    <div className="knapper-vertikalt">
                        <KnappBase type="hoved" onClick={() => history.push(FULLFOR_PATH)}>
                            <FormattedMessage id="knapp-riktig"/>
                        </KnappBase>
                        <LenkeAvbryt wrapperClassname="no-anim"/>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    brukersNavn: selectBrukersNavn(state),
    state: state
});

export default connect(mapStateToProps)(
    Oppsummering
);
