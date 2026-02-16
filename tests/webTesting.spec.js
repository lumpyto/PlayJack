const { test, expect } = require('@playwright/test');
import users from '../data/users.json';

test.describe('JACK Entertainment Page Tests', () => {
  const baseUrl = 'https://jackentertainment.lv-stg.gameaccount.com/';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

test('Successful Registration', async ({ page }) => {
    await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');

  let shortTime = new Date().toTimeString().slice(0, 5).replace(':', '');
  let username = `testAuto${shortTime}`;
  let email = users.newUserUser.username;
  let password = users.newUserUser.password;

  await page.click('text=Sign Up');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
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

  console.log(`Your username is ${username}`);
  console.log(`Your email is ${email}`);
  console.log(`Your password is ${password}`);
});


  test('Successful Login', async ({ page }) => {
     await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');
    
    let username = users.myUser.username
    let email = users.myUser.email;
    let password = users.myUser.password;

    await page.click('text=Login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.locator('button[data-qa="login_submit_btn"]').click();

    await page.locator('[data-qa="expand_account_menu"]').click();
    await expect(page.locator('.account-username')).toHaveText(username);
  });


  test.only('Bonus History (Optional)', async ({ page }) => {
    await expect(page).toHaveTitle('JACK Entertainment Online | Free Casino Games & Slots');
    
    let username = users.myUser.username
    let email = users.myUser.email;
    let password = users.myUser.password;

    await page.click('text=Login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.locator('button[data-qa="login_submit_btn"]').click();

    await page.locator('[data-qa="expand_account_menu"]').click(); 
    await page.locator('[data-qa="account_history"]').click();
    await expect(page).toHaveTitle('JACK Entertainment Online | Account History');
  });
});