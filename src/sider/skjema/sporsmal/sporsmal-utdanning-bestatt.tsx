import * as React from 'react';
import Alternativ from '../alternativ';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;
import { getTekstIdForSvar } from '../skjema-utils';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Svar, UtdanningBestattSvar } from '../../../ducks/svar-utils';

interface SporsmalProps {
    sporsmalId: string;
    endreSvar: (sporsmalId: string, svar: Svar) => void;
    hentAvgittSvar: (sporsmalId: string) => Svar | undefined;
}

type Props = SporsmalProps & InjectedIntlProps;

export default function UtdanningBestattSporsmal(props: Props) {
    const fellesProps = {
        endreSvar: props.endreSvar,
        intl: props.intl,
        avgiSvar: (svar: Svar) => props.endreSvar(props.sporsmalId, svar),
        getTekstId: (svar: Svar) => getTekstIdForSvar(props.sporsmalId, svar),
        hentAvgittSvar: () => props.hentAvgittSvar(props.sporsmalId)
    };
    return (
        <>
            <div className="spm-hode">
                <Innholdstittel tag="h1" className="spm-tittel">
                    {props.intl.messages[`${props.sporsmalId}-tittel`]}
                </Innholdstittel>
            </div>
            <form className="spm-skjema">
                <Alternativ svar={UtdanningBestattSvar.JA} {...fellesProps}/>
                <Alternativ svar={UtdanningBestattSvar.NEI} {...fellesProps}/>
            </form>
        </>
    );
}
