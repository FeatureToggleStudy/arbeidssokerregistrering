const createTestCafe = require('testcafe');
let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();

        return runner
            .startApp("cross-env PORT=4502 REACT_APP_MOCK_BES=true REACT_APP_MOCK=true npm start", 20000)
            .src(['integration/registrering.test.ts', 'integration/uu.test.ts'])
            .browsers(['chrome:headless'])
            .screenshots('./integration/screenshots/', true, '${BROWSER}_${TEST}.png')
            .run();
    })
    .then(failedCount => {
        console.log('Tests failed: ' + failedCount);
        testcafe.close();
    });