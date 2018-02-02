import * as React from 'react';
import { Provider } from 'react-redux';
import IntlProvider from './Intl-provider';
import getStore from './store';
import StartRegistrering from './start/start';
import RegVellykket from './regvellykket/regvellykket';
import Avbryt from './avbryt/avbryt';
import Fullfor from './fullfor/fullfor';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import SkjemaPanel from './skjema/skjema';
import Oppsummering from './oppsummering/oppsummering';
import SblRegistrering from './oppsummering/sbl-registrering';
import './decorator/decorator-mock';
import SjekkRegistreringstatus from './oppfolgingsstatus/sjekk-registreringstatus';
import HentInitialData from './initialdata/hent-initial-data';
import SjekkKrrStatus from './krr/sjekk-krr-status';
import {
    basename, START_PATH, OPPSUMMERING_PATH, SKJEMA_PATH, SBLREG_PATH, REGVELLYKKET_PATH,
    AVBRYT_PATH, FULLFOR_PATH, SISTEARBFORHOLD_PATH
} from './utils/konstanter';
import SisteArbeidsforhold from './arbeidsforhold/siste-arbeidsforhold';

const store = getStore();

class App extends React.Component {
    render() {
        return (
            <main id="maincontent" role="main" tabIndex={-1} className="arbsokreg_app">
                <Provider store={store}>
                    <IntlProvider >
                        <HentInitialData>
                            <SjekkKrrStatus>
                                <SjekkRegistreringstatus>
                                    <Router basename={basename}>
                                        <Switch>
                                            <Route path={START_PATH} component={StartRegistrering}/>
                                            <Route path={`${SKJEMA_PATH}/:id`} component={SkjemaPanel}/>
                                            <Route path={OPPSUMMERING_PATH} component={Oppsummering}/>
                                            <Route path={SBLREG_PATH} component={SblRegistrering}/>
                                            <Route path={REGVELLYKKET_PATH} component={RegVellykket}/>
                                            <Route path={AVBRYT_PATH} component={Avbryt} />
                                            <Route path={FULLFOR_PATH} component={Fullfor}/>
                                            <Route path={SISTEARBFORHOLD_PATH} component={SisteArbeidsforhold} />
                                            <Redirect exact={true} from="/" to={START_PATH}/>
                                        </Switch>
                                    </Router>
                                </SjekkRegistreringstatus>
                            </SjekkKrrStatus>
                        </HentInitialData>
                    </IntlProvider>
                </Provider>
            </main>
        );
    }
}

export default App;
