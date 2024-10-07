import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

let chromium: any;
let puppeteer: any;

if (env.NODE_ENV === "production") {
  chromium = require("@sparticuz/chromium");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

const isStringArray = (slug?: string | string[]): slug is string[] => {
  return !!slug;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId;
  const hasDocumentIds = isStringArray(documentId);

  if (!req.body && !hasDocumentIds) {
    return res.status(400);
  }

  let options = {};

  if (chromium) {
    options = {
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  }

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  if (hasDocumentIds) {
    await page.goto(`${env.NEXT_PUBLIC_BASE_URL}/d/${documentId}`, { waitUntil: "networkidle0" });
  } else {
    await page.setContent(req.body, { waitUntil: "networkidle0" });
  }

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "9.5mm",
      bottom: "9.5mm",
      left: "9.5mm",
      right: "9.5mm",
    },
  });
  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.write(pdf, "binary");
  res.end();
}
