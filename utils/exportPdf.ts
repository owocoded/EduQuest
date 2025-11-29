import jsPDF from 'jspdf';

interface QuestionData {
  mcqs: { question: string; options: string[]; answer: string }[];
  theory: string[];
}

export const exportToPdf = (questions: QuestionData, fileName: string = 'questions.pdf') => {
  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(16);
  doc.text('Generated Questions', 20, yPos);
  yPos += 15;

  // MCQs
  if (questions.mcqs && Array.isArray(questions.mcqs) && questions.mcqs.length > 0) {
    doc.setFontSize(14);
    doc.text('Multiple Choice Questions:', 20, yPos);
    yPos += 10;

    questions.mcqs.forEach((mcq, index) => {
      if (mcq && mcq.question && mcq.options && mcq.answer) {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${mcq.question}`, 20, yPos);
        yPos += 8;

        mcq.options.forEach(option => {
          if (option) {
            doc.text(`   ${option}`, 20, yPos);
            yPos += 6;
          }
        });

        doc.setFontSize(10);
        doc.text(`   Answer: ${mcq.answer}`, 20, yPos);
        yPos += 10;

        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    });
  }

  // Add some space
  yPos += 10;

  // Theory questions
  if (questions.theory && Array.isArray(questions.theory) && questions.theory.length > 0) {
    doc.setFontSize(14);
    doc.text('Theory Questions:', 20, yPos);
    yPos += 10;

    questions.theory.forEach((theory, index) => {
      if (theory) {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${theory}`, 20, yPos);
        yPos += 10;

        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    });
  }

  doc.save(fileName);
};