import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

export async function downloadResumeAsDocx(content: string, fileName: string = "Improved-Resume.docx") {
  const doc = new Document({
    sections: [{
      children: content.split('\n').map(
        (text) => new Paragraph({ children: [new TextRun(text)] })
      ),
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadResumeAsPdf(content: string, fileName: string = "Improved-Resume.pdf") {
  const doc = new jsPDF();
  
  // Basic settings - can be customized further
  const margin = 15;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  let y = margin;

  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const lines = content.split('\n');

  lines.forEach(line => {
    // Handle page breaks
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save(fileName);
}