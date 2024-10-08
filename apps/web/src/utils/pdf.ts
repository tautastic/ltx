import { env } from "~/env.mjs";

const buildValidFileName = (title?: string) => {
  try {
    if (title) {
      const sanitizedTitle = title
        .replace(/[<>:;,.?"*|/]/g, "")
        .trim()
        .replace(/\s+/g, "_");

      if (sanitizedTitle.length > 0) {
        return sanitizedTitle.concat(".pdf");
      }
    }
  } catch (_e) {}
  return "export.pdf";
};

export const downloadDocumentPdf = async (docUrl: string, docTitle?: string) => {
  const formData = new FormData();
  const credentials = btoa(`${env.GOTENBERG_API_BASIC_AUTH_USERNAME}:${env.GOTENBERG_API_BASIC_AUTH_PASSWORD}`);
  formData.append("url", docUrl);
  formData.append("paperWidth", "8.27");
  formData.append("paperHeight", "11.7");

  const res = await fetch(`${env.GOTENBERG_API_BASE_URL}/forms/chromium/convert/url`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    body: formData,
  });
  const blob = await res.blob();

  const href = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    target: "_blank",
    href,
    style: "display:none",
    download: buildValidFileName(docTitle),
  });
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(href);
  a.remove();
};
