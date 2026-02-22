import {test, expect} from '@playwright/test';
import users from '../data/users.json';

test.describe('JACK Entertainment Page Tests', () => {
  const baseUrl = 'https://jackentertainment.lv-stg.gameaccount.com/';

  test.describe.configure({ mode: 'serial' });

  let shared = {
    username: '',
    email:    '',
    password: ''
  };

  let faker;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);

    if (!faker) {
      const fakerModule = await import("@faker-js/faker");
      faker = fakerModule.faker;
    }
    if (!shared.username) {
      shared.username = faker.person.firstName().toLowerCase();
      shared.email    = faker.internet.email();
      shared.password = faker.internet.password({ length: 12 }) + '6';
    }
  });

test('Successful Registration', async ({ page }) => {
  await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');

  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Sign Up' }).click();

  await page.fill('input[name="username"]', shared.username);
  await page.fill('input[name="email"]', shared.email);
  await page.fill('input[name="password"]', shared.password);
  await page.click('button[data-qa="signup_submit_btn"]');

  let i = 0;
    while (i < 50 && !(await page.locator('.checkmark').isVisible())) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(600 + Math.random() * 400);
    i++;
    }

  await page.waitForTimeout(1500);
  await page.locator('[data-qa="signup_checkbox"]').click();
  await page.getByRole('button', { name: 'Continue' }).click({ force: true });

  console.log(`Your username is ${shared.username}`);
  console.log(`Your email is ${shared.email}`);
  console.log(`Your password is ${shared.password}`);

  //Check for successful registration. Login with Username
  await page.locator('.WelcomeBonus_iconClose__C5oab')
    .click({ timeout: 5000 })
    .catch(() => {});
  await page.locator('[data-qa="expand_account_menu"]', {delay:200}).click();
  await expect(page.locator('.account-username')).toHaveText(shared.username);
  await page.getByTitle("Logout").click();
  await expect(page).toHaveURL("https://jackentertainment.lv-stg.gameaccount.com/");
});


  test('Successful Login', async ({ page }) => {
    await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');
    
    let username = shared.username
    let email = shared.email;
    let password = shared.password;

    await page.click('text=Login');
    await page.fill('input[name="email"]', username);
    await page.fill('input[name="password"]', password);
    await page.locator('button[data-qa="login_submit_btn"]').click();

    await page.locator('[data-qa="expand_account_menu"]').click();
    await expect(page.locator('.account-username')).toHaveText(shared.username);
  });


test('Bonus History (Optional)', async ({ page }) => {
    await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');
    
    let username = shared.username
    let email = shared.email;
    let password = shared.password;

    await page.click('text=Login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.locator('button[data-qa="login_submit_btn"]').click();

    await page.locator('[data-qa="expand_account_menu"]').click(); 
    await page.locator('[data-qa="account_history"]').click();
    await expect(page).toHaveTitle('JACK Entertainment Online | Account History');
  });
});