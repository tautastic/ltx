import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { env } from "~/env.mjs";

const isStringArray = (slug?: string | string[]): slug is string[] => {
  return !!slug;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId;
  const hasDocumentIds = isStringArray(documentId);

  if (!req.body && !hasDocumentIds) {
    return res.status(400);
  }

  const browser = await puppeteer.launch();
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
