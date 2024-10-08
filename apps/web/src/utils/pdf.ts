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

export const downloadDocumentPdf = async (docId: string, docTitle?: string) => {
  const blob = await fetch(`/api/pdf/${docId}`, {
    method: "GET",
  }).then((r) => r.blob());

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
