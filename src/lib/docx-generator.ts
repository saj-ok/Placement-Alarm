import { Document, Packer, Paragraph, TextRun } from "docx";

export async function downloadResumeAsDocx(content: string) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: content.split('\n').map(
        (text) =>
          new Paragraph({
            children: [new TextRun(text)],
          })
      ),
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Improved-Resume.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}