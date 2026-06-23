// Client-only resume text extraction. This module must not reference browser-only
// APIs at the top level so that SSR can import it safely. Libraries are loaded
// dynamically inside the function, which is only called from browser event handlers.

export async function extractResumeText(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Resume parsing is only available in the browser.");
  }

  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
      text += pageText + "\n\n";
    }
    return text.trim();
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value.trim();
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}
