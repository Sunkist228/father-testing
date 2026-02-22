import { expect, test } from "@playwright/test";

const questions = [
  { question: "Q1", options: ["A", "B"], correctIndex: 0 },
  { question: "Q2", options: ["A", "B"], correctIndex: [0, 1] },
  { question: "Q3", options: ["A", "B"], correctIndex: 1 }
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/questions", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(questions)
    });
  });
});

test("Home -> Marathon -> Results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Marathon" }).click();
  await page.getByRole("button", { name: "Проверить" }).click({ trial: true }).catch(() => {});
  await page.getByRole("button", { name: "Завершить марафон" }).click();
  await expect(page.getByText("Результаты")).toBeVisible();
});

test("Test mode computes accuracy and shows result", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Контрольная сессия" }).click();
  await page.getByRole("button", { name: "A" }).first().click();
  await page.getByRole("button", { name: "Проверить" }).click();
  await page.getByRole("button", { name: "Завершить сессию" }).click();
  await expect(page.getByText("Точность")).toBeVisible();
});

test("Training page day completion", async ({ page }) => {
  await page.goto("/training");
  await page.getByRole("button", { name: "Отметить выполненным" }).first().click();
  await expect(page.getByText("Выполнено: 7%")).toBeVisible();
});

