import { chromium } from "playwright";
import { spawn } from "node:child_process";

const origin = "http://127.0.0.1:4173";
const basePath = "/territory-docs";
const preview = spawn(
  "npm",
  ["run", "docs:preview", "--", "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
  { stdio: ["ignore", "pipe", "pipe"] }
);

let previewOutput = "";
preview.stdout.on("data", (chunk) => { previewOutput += chunk.toString(); });
preview.stderr.on("data", (chunk) => { previewOutput += chunk.toString(); });

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (preview.exitCode !== null) {
      throw new Error(`VitePress preview exited early.\n${previewOutput}`);
    }
    try {
      const response = await fetch(`${origin}${basePath}/`);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`VitePress preview did not become ready.\n${previewOutput}`);
}

const expectedPages = [
  { path: "/architecture/diagrams.html", expectedDiagrams: 4 },
  { path: "/database/oracle-table-groups.html", expectedDiagrams: 1 }
];

let browser;
try {
  await waitForPreview();
  browser = await chromium.launch({ headless: true });

  for (const target of expectedPages) {
    const page = await browser.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      if (request.url().includes("cdn.jsdelivr.net/npm/mermaid")) {
        runtimeErrors.push(`Mermaid CDN request failed: ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
      }
    });

    const url = `${origin}${basePath}${target.path}`;
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    if (!response?.ok()) {
      throw new Error(`Could not load ${url}: HTTP ${response?.status() ?? "no response"}`);
    }

    await page.waitForFunction(
      (expectedCount) => {
        const diagrams = [...document.querySelectorAll("pre.mermaid")];
        return diagrams.length === expectedCount && diagrams.every((diagram) => {
          const svg = diagram.querySelector("svg");
          return svg && svg.querySelectorAll(".node").length > 0;
        });
      },
      target.expectedDiagrams,
      { timeout: 45_000 }
    );

    const rendered = await page.locator("pre.mermaid svg").count();
    if (rendered !== target.expectedDiagrams) {
      throw new Error(`${target.path}: expected ${target.expectedDiagrams} SVG diagrams, found ${rendered}`);
    }
    if (runtimeErrors.length > 0) {
      throw new Error(`${target.path}: browser errors:\n- ${runtimeErrors.join("\n- ")}`);
    }

    console.log(`PASS ${target.path}: ${rendered}/${target.expectedDiagrams} Mermaid diagrams rendered in Chromium`);
    await page.close();
  }

  const overview = await browser.newPage();
  const overviewUrl = `${origin}${basePath}/architecture/`;
  const overviewResponse = await overview.goto(overviewUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (!overviewResponse?.ok()) {
    throw new Error(`Could not load architecture overview: HTTP ${overviewResponse?.status() ?? "no response"}`);
  }
  const embeddedDiagrams = overview.frameLocator('iframe[title="Интерактивные Mermaid-схемы ППО ID Docs"]');
  await embeddedDiagrams.locator("pre.mermaid svg").first().waitFor({ timeout: 45_000 });
  const embeddedCount = await embeddedDiagrams.locator("pre.mermaid svg").count();
  if (embeddedCount !== 4) {
    throw new Error(`Architecture overview iframe: expected 4 rendered diagrams, found ${embeddedCount}`);
  }
  console.log(`PASS /architecture/: iframe displays all ${embeddedCount} rendered diagrams`);
  await overview.close();
} finally {
  if (browser) await browser.close();
  preview.kill("SIGTERM");
}
