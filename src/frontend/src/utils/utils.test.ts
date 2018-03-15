/*tslint:disable*/
import { expect } from 'chai';
import { State as SvarState } from '../ducks/svar';

import {
    getIntlMessage, getMapJaNeiKanskje, mapTilNuskode, getMapSituasjon, hentFornavn, mapAvgitteSvarForBackend,
    mapTilBoolean
} from './utils';
import {
    ANNET, JA, KANSKJE, MISTET_JOBBEN, NEI, NUSKODE_0, NUSKODE_2, NUSKODE_3, NUSKODE_4, NUSKODE_6, NUSKODE_7,
    PERMITTERT,
    SAGT_OPP,
    UNDER_UTDANNING,
    VIL_BYTTE_JOBB, YRKESPRAKSIS
} from './konstanter';

describe('utils test', () => {
    it('skal hente ut intl', () => {
        const id = 'ID';
        const tekst = 'tekst';
        const finnesIkke = 'finnesIkke';

        expect(getIntlMessage({[id]: tekst}, id )).to.equal(tekst);
        expect(getIntlMessage({[id]: tekst}, finnesIkke )).to.equal(finnesIkke);
    });
    
    it('test av hentFornavn', () => {
        expect(hentFornavn(undefined)).to.equal('');
        expect(hentFornavn('Test testesen')).to.equal('Test');
        expect(hentFornavn('TEST TESTESEN')).to.equal('Test');
        expect(hentFornavn('test testesen')).to.equal('Test');
        expect(hentFornavn('tEST TESTESEN')).to.equal('Test');
    });

    it('test mapping av situasjon', () => {
        expect(getMapSituasjon('1')).to.equal(MISTET_JOBBEN);
        expect(getMapSituasjon('2')).to.equal(SAGT_OPP);
        expect(getMapSituasjon('3')).to.equal(PERMITTERT);
        expect(getMapSituasjon('4')).to.equal(VIL_BYTTE_JOBB);
        expect(getMapSituasjon('5')).to.equal(UNDER_UTDANNING);
        expect(getMapSituasjon('6')).to.equal(ANNET);
    });

    it('test mapping av nuskode', () => {
        expect(mapTilNuskode(1)).to.equal(NUSKODE_0);
        expect(mapTilNuskode(2)).to.equal(NUSKODE_2);
        expect(mapTilNuskode(3)).to.equal(NUSKODE_3);
        expect(mapTilNuskode(4)).to.equal(NUSKODE_4);
        expect(mapTilNuskode(5)).to.equal(NUSKODE_6);
        expect(mapTilNuskode(6)).to.equal(NUSKODE_7);
    });

    it('test mapping av Ja, Nei, Kanskje', () => {
        expect(getMapJaNeiKanskje('1')).to.equal(JA);
        expect(getMapJaNeiKanskje('2')).to.equal(NEI);
        expect(getMapJaNeiKanskje('3')).to.equal(KANSKJE);
    });

    it('test hardkodet yrkespraksis', () => {
        expect(YRKESPRAKSIS).to.equal('5120.14');
    });

    it('test mapAvgitteSvarForBackend', () => {

        const yrkesPraksis = 'yrkesPraksis';
        const oppsummering = { tekst:  'oppsummer tekst' };
        const dummySvar: SvarState = {
            helse: 1,
            utdanning: 3
        };

        const expectData = {
            nusKode: mapTilNuskode(dummySvar.utdanning),
            yrkesPraksis: yrkesPraksis,
            enigIOppsummering: true,
            oppsummering: oppsummering.tekst,
            utdanningBestatt: false,
            utdanningGodkjentNorge: false,
            harHelseutfordringer: mapTilBoolean(dummySvar.helse),
        };
        expect(mapAvgitteSvarForBackend(dummySvar, oppsummering, yrkesPraksis)).to.deep.equal(expectData);
    });

});