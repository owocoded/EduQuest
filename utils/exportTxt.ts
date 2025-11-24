interface QuestionData {
  mcqs: { question: string; options: string[]; answer: string }[];
  theory: string[];
}

export const exportToTxt = (questions: QuestionData, fileName: string = 'questions.txt') => {
  let textContent = "Generated Questions\n";
  textContent += "==================\n\n";

  // MCQs
  if (questions.mcqs && questions.mcqs.length > 0) {
    textContent += "Multiple Choice Questions:\n";
    textContent += "---------------------------\n";

    questions.mcqs.forEach((mcq, index) => {
      textContent += `${index + 1}. ${mcq.question}\n`;
      mcq.options.forEach(option => {
        textContent += `   ${option}\n`;
      });
      textContent += `   Answer: ${mcq.answer}\n\n`;
    });
  }

  // Theory questions
  if (questions.theory && questions.theory.length > 0) {
    textContent += "\nTheory Questions:\n";
    textContent += "-----------------\n";

    questions.theory.forEach((theory, index) => {
      textContent += `${index + 1}. ${theory}\n`;
    });
  }

  const blob = new Blob([textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};