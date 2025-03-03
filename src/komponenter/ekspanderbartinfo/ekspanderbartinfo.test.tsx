/*tslint:disable*/
import * as React from 'react';
import { expect } from 'chai';
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EkspanderbartInfo from './ekspanderbartInfo';
import {shallowwithIntl} from "../../test/test-utils";

enzyme.configure({ adapter: new Adapter()});

describe('<EkspanderbartInfo />', () => {
    it('Skal default ikke vise innhold', () => {
        const wrapper = shallowwithIntl((<EkspanderbartInfo tittelId="fullfor-les-mer"><span className="Dummy"/></EkspanderbartInfo>));
        expect(wrapper.find('.Dummy')).to.have.length(0);
    });

    it('Skal vise innhold når knapp klikkes', () => {
        const wrapper = shallowwithIntl((<EkspanderbartInfo tittelId="fullfor-les-mer"><span className="Dummy"/></EkspanderbartInfo>));
        wrapper.find('.knapp-reset').simulate('click');
        expect(wrapper.find('.Dummy')).to.have.length(1);

    });
});
