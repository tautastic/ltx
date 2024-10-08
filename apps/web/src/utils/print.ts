const buildValidPageTitle = (title?: string) => {
  if (title) {
    const sanitizedTitle = title
      .replace(/[<>:;,.?"*|/]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    if (sanitizedTitle.length > 0) {
      return sanitizedTitle;
    }
  }
  return "export";
};

export const exportAsPdf = (title?: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const doc = window?.document;
  if (doc == null) {
    return;
  }
  const pdfTitle = buildValidPageTitle(title);
  const originalTitle = doc.title;
  window.onbeforeprint = () => {
    doc.title = pdfTitle;
  };
  window.onafterprint = () => {
    doc.title = originalTitle;
  };
  window.print();
};
