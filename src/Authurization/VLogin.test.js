const { chromium } = require('playwright');
jest.setTimeout(15000);
describe('Login Component Visual Regression Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    console.time('beforeEach');
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.waitForNavigation({ waitUntil: 'load' });
    console.timeEnd('beforeEach');
  });
  afterEach(async () => {
    await page.close();
  });

  it('should match the baseline screenshot', async () => {
    const elementHandle = await page.waitForSelector('.auth-form-container');

    await elementHandle.screenshot({ path: 'screenshots/login-component.png' });


    const baselinePath = 'screenshots/baseline/login-component.png';
    const screenshotPath = 'screenshots/login-component.png';
    expect(baselinePath).toEqual(screenshotPath);
  });
});
