import * as React from 'react';
import { Normaltekst, Innholdstittel, Systemtittel, Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import ResponsivSide from '../../komponenter/side/responsiv-side';
import { VEIENTILARBEID_MED_DAGPENGER_URL, VEIENTILARBEID_URL } from '../../ducks/api';
import AvsjekkAnimasjon from './avsjekk-animasjon';

const handinfoSvg = require('./handinfo.svg');

function DuErNaRegistrert() {
    return (
        <ResponsivSide className="du-er-na-registrert-wrapper">
            <div className="du-er-na-registrert__avsjekk-ikon">
                <AvsjekkAnimasjon/>
            </div>
            <Innholdstittel className="du-er-na-registrert__avsjekk-tittel">
                <FormattedMessage id="duernaregistrert-innholdstittel"/>
            </Innholdstittel>

            <div className="du-er-na-registrert__aksjonspanel">
                <div className="du-er-na-registrert__handinfo-ikon">
                    <img src={handinfoSvg} alt="Hånd med info skilt" className="illustrasjon"/>
                </div>
                <div className="du-er-na-registrert__tekster">
                    <Systemtittel className="blokk-xs">
                        <FormattedMessage id="duernaregistrert-systemtittel"/>
                    </Systemtittel>
                    <Normaltekst className="blokk">
                        <FormattedMessage id="duernaregistrert-normaltekst"/>
                    </Normaltekst>
                    <Element className="blokk-xxs">
                        <FormattedMessage id="duernaregistrert-element"/>
                    </Element>
                    <div className="du-er-na-registrert__knapperad">
                        <a href={VEIENTILARBEID_URL} className="knapp knapp--standard">
                            <FormattedMessage id="knapp-ikke-na"/>
                        </a>
                        <a href={VEIENTILARBEID_MED_DAGPENGER_URL} className="knapp knapp--hoved">
                            <FormattedMessage id="knapp-ja-vis-meg"/>
                        </a>
                    </div>
                </div>
            </div>
        </ResponsivSide>
    );
}

export default DuErNaRegistrert;