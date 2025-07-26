import { storage } from '../storage.js';
import { chatJSON } from './openaiClient.js';

// Dynamic import for pdf-parse to avoid startup issues
let pdfParse: any;
async function loadPdfParse() {
  if (!pdfParse) {
    try {
      pdfParse = (await import('pdf-parse')).default;
    } catch (error) {
      console.warn('[COA Parser] PDF parsing not available:', error);
    }
  }
  return pdfParse;
}

export async function ingestCOA(productId: string, fileBuffer: Buffer, url: string) {
  console.log(`[COA Parser] Processing COA for product ${productId}`);
  
  try {
    let textContent = '';
    
    // Try to parse as PDF first
    try {
      const parser = await loadPdfParse();
      if (parser) {
        const data = await parser(fileBuffer);
        textContent = data.text;
        console.log(`[COA Parser] Extracted ${textContent.length} characters from PDF`);
      } else {
        throw new Error('PDF parser not available');
      }
    } catch (pdfError) {
      console.warn('[COA Parser] PDF parsing failed, using fallback regex extraction');
      // Fallback to simple text extraction if PDF parsing fails
      textContent = fileBuffer.toString('utf8');
    }

    // Use AI to extract structured data from COA text
    const aiExtraction = await extractCOADataWithAI(textContent);
    
    // Naive regex extraction as fallback
    const potencyMatch = /THCA[:\s]+([\d.]+)/i.exec(textContent);
    const batchMatch = /Batch(?:\sNo\.?):?\s*([A-Za-z0-9-]+)/i.exec(textContent);
    const dateMatch = /(19|20)\d{2}[-/]\d{2}[-/]\d{2}/.exec(textContent);
    const labMatch = /(?:Lab|Laboratory)[:\s]+([^\\n]+)/i.exec(textContent);

    // Combine AI extraction with regex fallback
    const extractedData = {
      batchNumber: aiExtraction.batchNumber || batchMatch?.[1],
      potency: aiExtraction.potency || (potencyMatch ? { thca: parseFloat(potencyMatch[1]) } : null),
      testedAt: aiExtraction.testedAt || (dateMatch ? new Date(dateMatch[0]) : null),
      labName: aiExtraction.labName || labMatch?.[1]?.trim(),
      expirationDate: aiExtraction.expirationDate,
      contaminantResults: aiExtraction.contaminantResults,
      isValid: aiExtraction.isValid,
      validationErrors: aiExtraction.validationErrors || []
    };

    console.log(`[COA Parser] Extracted data:`, extractedData);

    // Create lab certificate record
    const labCertificate = await storage.createLabCertificate({
      productId,
      url,
      batchNumber: extractedData.batchNumber,
      potency: extractedData.potency,
      testedAt: extractedData.testedAt,
      labName: extractedData.labName,
      expirationDate: extractedData.expirationDate,
      contaminantResults: extractedData.contaminantResults,
      isValid: extractedData.isValid,
      validationErrors: extractedData.validationErrors,
      parsedByAI: true
    });

    // Update product with lab test info
    await storage.updateProduct(productId, {
      labTestUrl: url,
      batchNumber: extractedData.batchNumber,
      expirationDate: extractedData.expirationDate,
      requiresLabTest: false // now satisfied
    });

    console.log(`[COA Parser] Successfully processed COA for product ${productId}`);

    return {
      labCertificateId: labCertificate.id,
      extractedData,
      textLength: textContent.length
    };

  } catch (error) {
    console.error(`[COA Parser] Error processing COA for product ${productId}:`, error);
    throw error;
  }
}

async function extractCOADataWithAI(textContent: string) {
  try {
    const { choices: [{ message: { content } }] } = await chatJSON([
      {
        role: "system",
        content: `You are a cannabis lab testing expert. Extract key information from Certificate of Analysis (COA) documents.

Extract and return JSON with:
{
  "batchNumber": string | null,
  "potency": {
    "delta9": number,
    "thca": number,
    "cbd": number,
    "cbg": number,
    "cbn": number
  } | null,
  "testedAt": string | null, // ISO date
  "labName": string | null,
  "expirationDate": string | null, // ISO date
  "contaminantResults": {
    "pesticides": "pass" | "fail" | "not_tested",
    "heavyMetals": "pass" | "fail" | "not_tested",
    "microbials": "pass" | "fail" | "not_tested",
    "residualSolvents": "pass" | "fail" | "not_tested"
  } | null,
  "isValid": boolean,
  "validationErrors": string[]
}

Look for:
- Batch/Lot numbers
- Cannabinoid percentages (THC, THCA, CBD, etc.)
- Test dates
- Lab/Laboratory names
- Expiration dates
- Pass/Fail results for contaminants
- Any validation issues or missing data

Return null for missing data, not empty strings.`
      },
      {
        role: "user",
        content: `Extract data from this COA text:\n\n${textContent.substring(0, 4000)}`
      }
    ]);

    if (!content) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(content);
    
    // Convert date strings to Date objects
    if (parsed.testedAt) {
      parsed.testedAt = new Date(parsed.testedAt);
    }
    if (parsed.expirationDate) {
      parsed.expirationDate = new Date(parsed.expirationDate);
    }

    return parsed;

  } catch (error) {
    console.error('[COA Parser] AI extraction failed:', error);
    return {
      batchNumber: null,
      potency: null,
      testedAt: null,
      labName: null,
      expirationDate: null,
      contaminantResults: null,
      isValid: false,
      validationErrors: ['AI extraction failed']
    };
  }
}