export const buildValidFileName = (title?: string) => {
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
