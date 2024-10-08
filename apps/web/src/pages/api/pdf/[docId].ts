import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

const headersToCopy = ["Content-Type", "Content-Length", "Accept-Ranges", "Vary"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { docId } = req.query;

  if (typeof docId !== "string" || docId.length < 1) {
    res.status(400).end();
    return;
  }

  const pdfMargin = "15mm";
  const formData = new FormData();
  const credentials = btoa(`${env.GOTENBERG_API_BASIC_AUTH_USERNAME}:${env.GOTENBERG_API_BASIC_AUTH_PASSWORD}`);
  formData.append("url", `${env.NEXT_PUBLIC_BASE_URL}/d/${docId}`);
  formData.append("paperWidth", "8.27");
  formData.append("paperHeight", "11.7");
  formData.append("marginTop", pdfMargin);
  formData.append("marginRight", pdfMargin);
  formData.append("marginBottom", pdfMargin);
  formData.append("marginLeft", pdfMargin);
  formData.append("printBackground", "true");

  const pdfRes = await fetch(`${env.GOTENBERG_API_BASE_URL}/forms/chromium/convert/url`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    body: formData,
  });
  const pdfBuffer = await pdfRes.arrayBuffer().then((pdf) => Buffer.from(pdf));

  if (!pdfBuffer) {
    res.status(400).end();
    return;
  }

  res.status(pdfRes.status);
  pdfRes.headers.forEach((name, value) => {
    if (name in headersToCopy) {
      res.setHeader(name, value);
    }
  });

  res.write(pdfBuffer, "binary");
  res.end();
}

export const config = {
  maxDuration: 60,
};
