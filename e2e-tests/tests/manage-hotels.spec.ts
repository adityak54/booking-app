import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5174/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("aaditya@gmail.com");
  await page.locator("[name=password]").fill("1Aditya1");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);
  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is description for the test hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "1");
  await page.getByText("Budget").click();
  await page.getByLabel("Free Wifi").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("2");

  await page.setInputFiles('[name="imageFiles"]',[
    path.join(__dirname,"files",'1.jpg'),
    // path.join(__dirname,"files",'2.jpg')
  ]);
  
  await page.getByRole("button", {name: "Save"}).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
  // await expect(page.getByText("Registration Success!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Silver")).toBeVisible();
  await expect(page.getByText("Decent")).toBeVisible();
  await expect(page.getByText("Prayagraj, India")).toBeVisible();
  await expect(page.getByText("Family")).toBeVisible();
  await expect(page.getByText("£1000 per night")).toBeVisible();
  await expect(page.getByText("1 adults, 0 children")).toBeVisible();
  await expect(page.getByText("3 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Silver");
  await page.locator('[name="name"]').fill("Silver UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "Silver UPDATED"
  );
  await page.locator('[name="name"]').fill("Silver");
  await page.getByRole("button", { name: "Save" }).click();
});
