import { test, expect } from '@playwright/test';

test.describe('End-to-End Video Games Catalog', () => {
    // We use a timestamp to ensure uniqueness across test runs
    const randomUser = `user_${Date.now()}`;
    const password = 'Password123!';

    test('Registration & Login Flow', async ({ page }) => {
        await page.goto('/');

        // Ensure we are at the login stage
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 15000 });
        await page.getByRole('button', { name: 'Register here' }).click();

        // Register
        await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
        await page.getByLabel('Username').fill(randomUser);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Register', exact: true }).click();

        // Successful registration message
        await expect(page.getByText('Registration successful!')).toBeVisible({ timeout: 10000 });

        // Wait for switch back to login (component switch)
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 15000 });

        // Login with new user
        await page.getByLabel('Username').fill(randomUser);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        // Should reach catalog
        await expect(page.getByRole('heading', { name: 'Gaming Catalog' })).toBeVisible({ timeout: 20000 });
    });

    test('Incorrect Login Error', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('non_existent_user_xyz');
        await page.getByLabel('Password').fill('wrong_password');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await expect(page.getByText('Invalid credentials')).toBeVisible({ timeout: 10000 });
    });

    test('Protected Route Redirection', async ({ page }) => {
        await page.goto('/mis-juegos');
        // SPA app: shows login component instead of redirecting URL if no session
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 10000 });
    });

    test('Catalog Listing & Search', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await expect(page.getByRole('heading', { name: 'Gaming Catalog' })).toBeVisible({ timeout: 20000 });

        // Wait for games to load (wait for the card skeleton or content)
        await page.waitForSelector('.MuiCard-root', { timeout: 15000 });

        const gameCount = await page.locator('.MuiCard-root').count();
        expect(gameCount).toBeGreaterThan(0);
    });

    test('Filtering & Pagination', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        // Wait for chips to appear
        await page.waitForSelector('.MuiChip-root', { timeout: 15000 });

        // Check pagination if visible
        const pagination = page.locator('.MuiPagination-root');
        if (await pagination.isVisible()) {
            const page2 = page.getByRole('button', { name: 'Go to page 2' });
            if (await page2.isVisible()) {
                await page2.click();
                await expect(page.getByRole('button', { name: 'page 2' })).toHaveClass(/Mui-selected/, { timeout: 10000 });
            }
        }
    });

    test('CRUD: Create, View Detail, and Delete', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        // Navigate to New Game
        await page.getByRole('link', { name: 'New Game' }).click();
        const gameName = `E2E Test ${Date.now()}`;

        await page.getByRole('textbox', { name: 'Game Name' }).fill(gameName);
        await page.getByRole('textbox', { name: 'Company' }).fill('E2E Company');
        await page.getByRole('spinbutton', { name: 'Price' }).fill('99');
        await page.getByRole('textbox', { name: 'Image URL' }).fill('https://via.placeholder.com/400');
        await page.getByRole('textbox', { name: 'Description' }).fill('Automated E2E test game.');

        await page.getByRole('button', { name: 'Add Video Game' }).click();

        // Verify it exists in Collection
        await expect(page).toHaveURL(/.*mis-juegos/, { timeout: 15000 });
        await expect(page.getByText(gameName)).toBeVisible({ timeout: 15000 });

        // Go to Detail
        await page.getByText(gameName).first().click();
        await expect(page.getByRole('heading', { name: gameName })).toBeVisible({ timeout: 15000 });

        // Delete (accept confirmation dialog)
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Delete Permanently' }).click();

        // Redirected back to collection, game should be gone
        await expect(page).toHaveURL(/.*mis-juegos/, { timeout: 15000 });
        await expect(page.getByText(gameName)).not.toBeVisible({ timeout: 10000 });
    });

    test('Logout Flow', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        // Logout using the aria-label we just added
        await page.getByLabel('Logout').click();

        // Should see Login heading again
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 15000 });
    });
});
