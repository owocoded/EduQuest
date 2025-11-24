# EduQuest - AI-Powered Question Generation

EduQuest is a web application that allows users to upload learning materials and automatically generate exam questions using AI.

## Features

- Upload PDF, DOCX, PPTX, and TXT files
- Extract text from various document formats
- Generate multiple choice questions (MCQs) and theory questions
- Use of AI engines (primary: Gemini 1.5 Flash, backup: HuggingFace)
- Download results in PDF, DOCX, or TXT formats
- No authentication required for version 1

## Tech Stack

- Frontend: Next.js 14 with Tailwind CSS
- Backend: Convex
- AI: Gemini 1.5 Flash and HuggingFace
- File Processing: pdf-parse, mammoth, officeparser

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eduquest
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npm install convex
npx convex dev
```

4. Add environment variables to `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
CONVEX_GEMINI_API_KEY=<your-gemini-api-key>
CONVEX_HF_API_KEY=<your-huggingface-api-key>
```

5. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_CONVEX_URL` - Your Convex backend URL
- `CONVEX_GEMINI_API_KEY` - Google Gemini API key
- `CONVEX_HF_API_KEY` - Hugging Face API key

## API Keys

To use this application, you need API keys from:
- Google Gemini: https://ai.google.dev/
- Hugging Face: https://huggingface.co/

## Project Structure

```
/app
  /api
    /upload
  /preview
    /[id]
  /results
/components
/convex
  /actions
  /mutations
/utils
  exportPdf.ts
  exportDocx.ts
  exportTxt.ts
/lib
```

## File Processing

The app supports these file formats:
- PDF (Portable Document Format)
- DOCX (Microsoft Word documents)
- PPTX (Microsoft PowerPoint presentations)
- TXT (Plain text files)

## AI Question Generation

The app uses two AI engines for question generation:
1. **Gemini 1.5 Flash** (Primary) - Fast and accurate
2. **HuggingFace** (Backup) - Reliable alternative

## Export Formats

Results can be downloaded in:
- PDF format using jsPDF
- DOCX format using docx
- TXT format as plain text

## Deployment

To build and deploy the application:
```bash
npm run build
npm start
```

For deployment on Vercel:
```bash
vercel
```

## License

This project is licensed under the MIT License.