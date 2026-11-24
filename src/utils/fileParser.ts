// File parser for user uploaded resumes (PDF, TXT, DOCX, MD, RTF)
// Supports client-side extraction with local worker and high-fidelity server OCR fallback

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file for processing'));
    reader.readAsDataURL(file);
  });
}

async function parseViaServer(file: File): Promise<string> {
  const base64Data = await fileToBase64(file);
  const response = await fetch('/api/parse-cv-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileData: base64Data,
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(
      errorJson.error || `Could not read document contents from "${file.name}". Please paste text directly.`
    );
  }

  const data = await response.json();
  if (!data.text || typeof data.text !== 'string' || data.text.trim().length < 15) {
    throw new Error(`No readable text found in "${file.name}". The file may be image-only scanned.`);
  }

  return data.text.trim();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Plain text formats (.txt, .md, .rtf, .csv, .json, text/*)
  if (
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.rtf') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.json') ||
    file.type.startsWith('text/')
  ) {
    try {
      const text = await file.text();
      if (text && text.trim().length >= 10) {
        return text.trim();
      }
    } catch {
      // Fallback to server
      return await parseViaServer(file);
    }
  }

  // 2. Word Documents (.docx)
  if (
    fileName.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const res = await mammoth.extractRawText({ arrayBuffer });
      if (res && res.value && res.value.trim().length >= 25) {
        return res.value.trim();
      }
    } catch (docxErr) {
      console.warn('Client-side docx parsing fallback to server:', docxErr);
    }

    // Server-side mammoth fallback
    return await parseViaServer(file);
  }

  // 3. PDF Files (.pdf)
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    // Attempt client-side parsing with pdfjs-dist and local worker
    try {
      const pdfjs = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && pdfjs.GlobalWorkerOptions) {
        // Point to the local worker in /public
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY: number | null = null;
        let pageText = '';

        for (const item of textContent.items) {
          if ('str' in item && typeof (item as any).str === 'string') {
            const itemStr = (item as any).str;
            const itemY = (item as any).transform ? (item as any).transform[5] : null;

            // Preserve line breaks based on vertical coordinate changes
            if (lastY !== null && itemY !== null && Math.abs(itemY - lastY) > 5) {
              pageText += '\n';
            } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' ';
            }
            pageText += itemStr;
            if (itemY !== null) {
              lastY = itemY;
            }
          }
        }

        if (pageText.trim()) {
          fullText += pageText.trim() + '\n\n';
        }
      }

      const cleaned = fullText
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (cleaned.length >= 40) {
        return cleaned;
      }
    } catch (pdfErr) {
      console.warn('Client-side PDF extraction failed, routing to server parser:', pdfErr);
    }

    // Robust server-side PDFParse & Gemini OCR fallback
    return await parseViaServer(file);
  }

  // 4. Any other binary or unknown format
  return await parseViaServer(file);
}
