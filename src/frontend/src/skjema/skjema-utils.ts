import { State as SvarState } from '../ducks/svar';

/*
* ConfigSpmPrSide
* key = sideurl
* value = sporsmål id
* */
export const configSpmPrSide = {
    1: ['1'],
    2: ['2'],
    3: ['3'],
    4: ['4'],
    5: ['5']
};

/*
* Konfigurasjon
*
* Selvgående bruker
*
* key: spørsmål id
* value: [svar id] // liste med alternativ svar - gir utslag som selvgående bruker
*
* */
export const configSelvgaende = {
    1: ['1', '2', '3', '4', '5'],
    2: ['2', '3'],
    3: ['1'],
    4: ['1'],
    5: ['2'],
};

export const erSelvgaende = (svar: SvarState, svarSomGirSelvgaende: {}) => {
    let resultat = true;
    Object.keys(svar).map((key) => {
        const res = svarSomGirSelvgaende[key].filter((configSvar: string) => configSvar === svar[key]);
        if (res.length === 0) { resultat = false; }
    });

    return resultat;
};

export const erSvarAlternativMerEnnTo = (spmId: string) => {
    let classname = '';
    if (spmId !== '1' && spmId !== '2') {
        classname = 'form-flex';
    }
    return classname;
};
