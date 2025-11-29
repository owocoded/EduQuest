import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface QuestionData {
  mcqs: { question: string; options: string[]; answer: string }[];
  theory: string[];
}

export const exportToDocx = (questions: QuestionData, fileName: string = 'questions.docx') => {
  const paragraphs = [];

  paragraphs.push(new Paragraph({
    text: "Generated Questions",
    heading: HeadingLevel.HEADING_1,
  }));

  // MCQs
  if (questions.mcqs && Array.isArray(questions.mcqs) && questions.mcqs.length > 0) {
    paragraphs.push(new Paragraph({
      text: "Multiple Choice Questions:",
      heading: HeadingLevel.HEADING_2,
    }));

    questions.mcqs.forEach((mcq, index) => {
      if (mcq && mcq.question && mcq.options && mcq.answer) {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${mcq.question}`,
              bold: true
            })
          ]
        }));

        mcq.options.forEach(option => {
          if (option) {
            paragraphs.push(new Paragraph({
              children: [
                new TextRun(`   ${option}`)
              ]
            }));
          }
        });

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: `   Answer: ${mcq.answer}`,
              italics: true
            })
          ]
        }));

        // Add blank line
        paragraphs.push(new Paragraph(""));
      }
    });
  }

  // Theory questions
  if (questions.theory && Array.isArray(questions.theory) && questions.theory.length > 0) {
    paragraphs.push(new Paragraph({
      text: "Theory Questions:",
      heading: HeadingLevel.HEADING_2,
    }));

    questions.theory.forEach((theory, index) => {
      if (theory) {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun(`${index + 1}. ${theory}`)
          ]
        }));
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, fileName);
  });
};