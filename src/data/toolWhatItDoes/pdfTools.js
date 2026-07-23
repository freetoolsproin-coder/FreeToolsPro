export default {
  "/pdf-tools/pdf-converter": {
    paragraphs: [
      "FreeToolsPro PDF Tools is a browser workspace for common PDF tasks. PDF to JPG renders pages client-side with pdf.js. The PDF Editor adds simple text overlays. PDF to Word only runs when a conversion API key is configured—otherwise that tab explains that Word export is unavailable.",
      "PDF remains useful for contracts, invoices, and forms because layout stays consistent across devices. Use JPG export for previews and thumbnails; keep original PDFs as the source of truth.",
    ],
    sections: [
      {
        title: "What works in the browser today",
        paragraphs: [
          "PDF to JPG exports page images without uploading to our servers. Simple text edits stay local to your session. Review outputs before sharing—complex layouts may need desktop software.",
          "PDF to Word depends on a third-party conversion API. Without a configured key, the Word mode shows an unavailable notice instead of pretending to convert.",
        ],
      },
      {
        title: "Privacy and best practices",
        paragraphs: [
          "Prefer local JPG/edit modes for sensitive files when possible. Clear downloads on shared computers. Archive immutable originals even after successful exports.",
        ],
      },
    ],
  },
};
