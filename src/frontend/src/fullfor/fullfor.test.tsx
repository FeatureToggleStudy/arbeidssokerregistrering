/*tslint:disable*/
import * as React from 'react';
import {expect} from 'chai';
import * as sinon from 'sinon';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import {Knapp} from 'nav-frontend-knapper';
import {shallowWithIntl} from 'enzyme-react-intl';
import Fullfor from './fullfor';
import KnappFullfor from '../skjema/knapp-fullfor';
import {Checkbox} from "nav-frontend-skjema";
import {
    FetchStub, mountWithStoreAndIntl, promiseWithSetTimeout,
    stubFetch
} from "../test/test-utils";
import {create} from "../store";
import {REGVELLYKKET_PATH} from "../utils/konstanter";

enzyme.configure({adapter: new Adapter()});
afterEach(() => {
    if (fetch.restore) {
        fetch.restore()
    }
});

describe('<Fullfor />', () => {
    it('Skal ha fullfor knapp som er inaktiv', () => {
        const props = {};

        const wrapper = mountWithStoreAndIntl(<Fullfor {...props} />);
        const knappFullfor = wrapper.find(KnappFullfor);
        expect(knappFullfor.props().disabled).to.be.true;
    });

    it('Skal enable fullfor knappen når sjekkboks markeres', () => {
        const props = {};

        const wrapper = mountWithStoreAndIntl((<Fullfor {...props} />));
        const sjekkboks = wrapper.find(Checkbox);
        const input = sjekkboks.find('input[type="checkbox"]');

        input.simulate('change');

        const knappFullfor = wrapper.find(KnappFullfor);
        expect(knappFullfor.props().disabled).to.be.false;
    });

    it('Skal vise feilmelding dersom fullfor feiler', () => {
        const store = create();
        const push = sinon.spy();
        const props = {
            history: {
                push
            }
        };

        stubFetch(new FetchStub().addErrorResponse('/registrerbruker', 500));

        const wrapper = mountWithStoreAndIntl(<Fullfor {...props} />, store);

        // marker sjekkboks
        const sjekkboks = wrapper.find(Checkbox);
        const input = sjekkboks.find('input[type="checkbox"]');
        input.simulate('change');

        // simuler klikk
        wrapper.find(KnappFullfor).simulate('click');

        // forventet resultat
        return promiseWithSetTimeout()
            .then(() => {
                wrapper.update()
                expect(wrapper.html()).to.include('innholdslaster-feilmelding');
            });
    });

    it('Skal vise registrering vellykket', () => {
        const store = create();
        const push = sinon.spy();
        const props = {
            history: {
                push
            }
        };

        stubFetch(new FetchStub().addResponse('/registrerbruker', {}));

        const wrapper = mountWithStoreAndIntl(<Fullfor {...props} />, store);

        // marker sjekkboks
        const sjekkboks = wrapper.find(Checkbox);
        const input = sjekkboks.find('input[type="checkbox"]');
        input.simulate('change');

        // simuler klikk
        wrapper.find(KnappFullfor).simulate('click');

        // forventet resultat
        return promiseWithSetTimeout()
            .then(() => {
                wrapper.update()
                expect(push.firstCall.args[0]).to.be.equal(`${REGVELLYKKET_PATH}`);
            });
    });

});