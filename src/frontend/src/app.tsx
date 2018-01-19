import * as React from 'react';
import { Provider } from 'react-redux';
import IntlProvider from './Intl-provider';
import getStore from './store';
import RegistrerDeg from './registrer/registrerdeg';
import StartRegistrering from './start/start';
import RegVelykket from './regvelykket/regvelykket';
import Avbryt from './avbryt/avbryt';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import SkjemaPanel from './skjema/skjema';
import Oppsummering from './oppsummering/oppsummering';
import SblRegistrering from './oppsummering/sbl-registrering';
import './decorator/decorator-mock';
import SjekkRegistreringstatus from './oppfolgingsstatus/sjekk-registreringstatus';
import HentInitialData from './initialdata/hent-initial-data';

const store = getStore();
export const basename = '/arbeidssokerregistrering';

class App extends React.Component {
    render() {
        return (
            <main id="maincontent" role="main" tabIndex={-1} className="arbsokreg_app">
                <Provider store={store}>
                    <IntlProvider>
                        <HentInitialData>
                            <SjekkRegistreringstatus>
                                <Router basename={basename}>
                                    <div>
                                        <Route path="/start" component={StartRegistrering}/>
                                        <Route path="/registrer" component={RegistrerDeg}/>
                                        <Route path="/skjema/:id" component={SkjemaPanel}/>
                                        <Route path="/oppsummering" component={Oppsummering}/>
                                        <Route path="/sblregistrering" component={SblRegistrering}/>
                                        <Route path="/regvelykket" component={RegVelykket}/>
                                        <Route path="/avbryt" component={Avbryt}/>
                                    </div>
                                </Router>
                            </SjekkRegistreringstatus>
                        </HentInitialData>
                    </IntlProvider>
                </Provider>
            </main>
        );
    }
}

export default App;
