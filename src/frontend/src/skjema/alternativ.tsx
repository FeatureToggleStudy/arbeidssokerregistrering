import * as React from 'react';
import { Radio } from 'nav-frontend-skjema';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;
import { hentValgteAlternativ } from './skjema-utils';

export type EndreSvar = (sporsmalId: string, alternativId: string) => void;

interface AlternativProps {
    tekstId: string;
    sporsmalId: string;
    checked: boolean | undefined;
    endreSvar: EndreSvar;
}

const onChange = (endreSvar: EndreSvar, sporsmalId: string) => () => (endreSvar(sporsmalId, hentValgteAlternativ()));

function Alternativ({tekstId, sporsmalId, endreSvar, checked, intl}: AlternativProps & InjectedIntlProps) {
    const tekst = intl.messages[tekstId];
    return (
        <Radio
            onChange={onChange(endreSvar, sporsmalId)}
            className="blokk-xs"
            name={'alternativ'}
            label={tekst}
            value={tekst}
            checked={checked}
        />);
}

export default Alternativ;