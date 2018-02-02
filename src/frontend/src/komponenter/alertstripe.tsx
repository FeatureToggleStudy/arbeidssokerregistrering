import * as React from 'react';
import NavAlertStripe, { AlertstripeTypes } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    type: AlertstripeTypes;
    tekst: string;
}

function Alertstripe({ type, tekst}: Props) {
    return(
        <NavAlertStripe type={type}>
            <Normaltekst><span dangerouslySetInnerHTML={{__html: tekst}}/></Normaltekst>
        </NavAlertStripe>
    );
}

export default Alertstripe;