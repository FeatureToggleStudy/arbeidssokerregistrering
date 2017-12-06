import * as React from 'react';
import {Provider} from 'react-redux';
import IntlProvider from './Intl-provider';
import getStore from './store';
import RegistrerDeg from './registrerdeg';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import SkjemaPanel from "./skjema/skjema-panel";

const store = getStore();

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <IntlProvider>
                    <Router basename="/arbeidsokerregistrering">
                        <div>
                            <Route path="/registrer" component={RegistrerDeg}/>
                            <Route path="/skjema/:id" component={SkjemaPanel}/>
                        </div>
                    </Router>
                </IntlProvider>
            </Provider>
        );
    }
}

export default App;
