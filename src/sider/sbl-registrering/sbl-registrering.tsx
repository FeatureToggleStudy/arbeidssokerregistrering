import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import KnappBase from 'nav-frontend-knapper';
import PanelBlokk from '../../komponenter/panel-blokk/panel-blokk';
import PanelBlokkGruppe from '../../komponenter/panel-blokk/panel-blokk-gruppe';
import { DITTNAV_URL, registrerBrukerSBLArbeid, SBLARBEID_OPPRETT_MIN_ID_URL } from '../../ducks/api';
import { STATUS } from '../../ducks/api-utils';
import Innholdslaster from '../../komponenter/innholdslaster/innholdslaster';
import { sendBrukerTilSblArbeid } from '../oppsummering/oppsummering-utils';
import Loader from '../../komponenter/loader/loader';

interface State {
    status: string;
}

interface SblRegistreringConfig {
    sendBrukerTilSblArbeid: () => void;
    opprettSBLArbeidBruker: () => void;
}

interface Props {
    config?: SblRegistreringConfig;
    opprettSBLArbeidBruker?: boolean;
}

export function opprettSBLArbeidBruker() {
    document.location.href = SBLARBEID_OPPRETT_MIN_ID_URL;
}

class SblRegistrering extends React.Component<Props, State> {
    static defaultProps: Partial<Props> = {
        config: {
            sendBrukerTilSblArbeid: sendBrukerTilSblArbeid,
            opprettSBLArbeidBruker: opprettSBLArbeidBruker,
        },
        opprettSBLArbeidBruker: false
    };

    constructor(props: {}) {
        super(props);
        this.state = {status: STATUS.OK};
        this.opprettMinIdISblOgSendBrukerTilSBLCvRegistrering =
            this.opprettMinIdISblOgSendBrukerTilSBLCvRegistrering.bind(this);
    }

    componentDidMount() {
        if (this.props.opprettSBLArbeidBruker) {
            this.opprettSBLArbeidBruker();
            return;
        }

        if (window.innerWidth > 768) {
            this.opprettMinIdISblOgSendBrukerTilSBLCvRegistrering();
        }
    }

    opprettSBLArbeidBruker() {
        const { config } = this.props;
        config!.opprettSBLArbeidBruker();
    }

    opprettMinIdISblOgSendBrukerTilSBLCvRegistrering() {
        const { config } = this.props;
        this.setState({status: STATUS.PENDING},
                      () => registrerBrukerSBLArbeid()
                        .then(config!.sendBrukerTilSblArbeid, config!.sendBrukerTilSblArbeid));
    }

    render() {

        // For å være sikker på at bruker ikke ser noe innhold før spinner rendres
        if (window.innerWidth > 768 && this.state.status === STATUS.OK) {
            return null;
        }

        return (
            <Innholdslaster avhengigheter={[this.state]} storrelse="XXL" loaderKomponent={<Loader/>}>
                <PanelBlokkGruppe
                    knappAksjoner={
                        [
                            <KnappBase
                                key="1"
                                type="standard"
                                onClick={() => document.location.href = DITTNAV_URL}
                                className="sbl-registrering__knapp"
                            >
                                <FormattedMessage id="knapp-sbl-registrering-avbryt"/>
                            </KnappBase>,
                            <KnappBase
                                key="2"
                                type="hoved"
                                className="sbl-registrering__knapp"
                                onClick={this.opprettMinIdISblOgSendBrukerTilSBLCvRegistrering}
                            >
                                <FormattedMessage id="knapp-sbl-registrering-neste"/>
                            </KnappBase>
                        ]
                    }
                >
                    <PanelBlokk
                        tittelId="overskrift-registrering-pc"
                        tittelCssNavnVariant="rod-variant"
                        beskrivelseId="beskrivelse-registrering-pc"
                    />
                </PanelBlokkGruppe>
            </Innholdslaster>
        );
    }
}

export default SblRegistrering;