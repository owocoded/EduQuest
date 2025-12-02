import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text from different file types on the client side
 * @param file - The uploaded file
 * @returns Extracted text as a string
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
      fileName.endsWith('.pptx')
    ) {
      return await extractTextFromPptx(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, DOCX, PPTX, or TXT file.');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from the file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract text from PDF files using pdfjs-dist
 */
const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    pageTexts.push(pageText);
  }

  return pageTexts.join('\n\n');
};

/**
 * Extract text from DOCX files using mammoth
 */
const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extract text from PPTX files using officeparser
 */
const extractTextFromPptx = async (file: File): Promise<string> => {
  // For now, since officeparser is a server-side library, we'll use a simpler approach
  // In a future enhancement, we could use a client-side library like pptxjs
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        // This is a placeholder for PPTX text extraction
        // In a real implementation, we'd use a client-side PPTX parser
        const arrayBuffer = reader.result as ArrayBuffer;
        // For now, return a message indicating we need to implement PPTX extraction
        resolve(`PPTX text extraction would happen here. File: ${file.name}, Size: ${file.size} bytes`);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read PPTX file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extract text from TXT files
 */
const extractTextFromTxt = async (file: File): Promise<string> => {
  const text = await file.text();
  return text;
};