import '../test/test-setup';
import * as React from 'react';
import { expect } from 'chai';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { sblUrl } from '../oppsummering/sbl-registrering';
import SjekkOppfolgingsstatusWrapper, { veienTilArbeid } from './sjekk-oppfolgingsstatus-wrapper';
import {
    makeHrefWritable, mountWithStore, promiseWithSetTimeout, store, stubFetchWithErrorResponse,
    stubFetchWithResponse,
    zeroTimeoutPromise
} from '../test/test-utils';

enzyme.configure({adapter: new Adapter()});

afterEach(() => fetch.restore());

describe('<SjekkOppfolginsstautsWrapper />', () => {
    it('skal sende bruker til sbl om den ikke oppfyller krav og ikke er under oppfølging', () => {
        makeHrefWritable();

        stubFetchWithResponse({underOppfolging: false, oppfyllerKrav: false});

        mountWithStore(<SjekkOppfolgingsstatusWrapper />);

        return promiseWithSetTimeout()
            .then(() => expect(document.location.href).to.equal(sblUrl));
    });

    it('skal sende bruker til veien til arbeid om den er under oppfølging', () => {
        makeHrefWritable();

        stubFetchWithResponse({underOppfolging: true, oppfyllerKrav: false});

        mountWithStore(<SjekkOppfolgingsstatusWrapper />);

        return promiseWithSetTimeout()
            .then(() => expect(document.location.href).to.equal(veienTilArbeid));
    });
    it('Skal rendre innhold dersom bruker oppfyller krav og ikke er under oppfølging', () => {
        stubFetchWithResponse({underOppfolging: false, oppfyllerKrav: true});

        const wrapper = mountWithStore(
            <SjekkOppfolgingsstatusWrapper >
            <div className="Dummy"/>
        </SjekkOppfolgingsstatusWrapper>);

        return promiseWithSetTimeout()
            .then(() => expect(wrapper.html()).to.have.string('Dummy'));

    });

    it('skal rendre feilmelding dersom henting av status feiler', () => {
        stubFetchWithErrorResponse();

        const wrapper = mountWithStore(<SjekkOppfolgingsstatusWrapper />);

        return promiseWithSetTimeout()
            .then(() => expect(wrapper.html()).to.have.string('innholdslaster-feilmelding'));
    });
});