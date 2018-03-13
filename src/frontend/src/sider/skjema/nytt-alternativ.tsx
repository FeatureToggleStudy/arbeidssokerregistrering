import * as React from 'react';
import { Radio } from 'nav-frontend-skjema';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;

export type EndreSvar = (sporsmalId: string, alternativId: string) => void;

interface AlternativProps {
    hentAvgittSvar: () => number | undefined;
    alternativId: number;
    avgiSvar: (alternativId: number) => void;
    getTekstId: (alternativId: number) => string;
}

function NyttAlternativ(props: AlternativProps & InjectedIntlProps) {
    const tekst = props.intl.messages[props.getTekstId(props.alternativId)];
    return (
        <Radio
            onChange={() => props.avgiSvar(props.alternativId)}
            className="blokk-xs"
            name={'alternativ'}
            label={tekst}
            value={tekst}
            checked={props.hentAvgittSvar() === props.alternativId}
        />);
}

export default NyttAlternativ;