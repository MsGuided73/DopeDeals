import { storage } from '../storage.js';
import { chatJSON } from './openaiClient.js';
import { z } from 'zod';

const classificationSchema = z.object({
  categories: z.array(z.enum(["THCA", "Kratom", "7-Hydroxy", "Nicotine", "Other"])),
  nicotineProduct: z.boolean(),
  requiresLabTest: z.boolean(),
  hiddenReason: z.string().optional()
});

export async function classifyProduct(productId: string) {
  const product = await storage.getProduct(productId);
  if (!product) throw new Error("Product not found");

  console.log(`[AI Classifier] Processing product: ${product.name}`);

  try {
    const { choices: [{ message: { content } }] } = await chatJSON([
      {
        role: "system",
        content: `You are a compliance-classification agent for VIP Smoke.
Return JSON matching this schema:

{
  "categories": ["THCA" | "Kratom" | "7-Hydroxy" | "Nicotine" | "Other"...],
  "nicotineProduct": boolean,
  "requiresLabTest": boolean,
  "hiddenReason": string?    // if product must be hidden on main site
}

Rules:
• Any cannabinoid (delta-8, delta-9, THCA, THCP) => category THCA, requiresLabTest true.
• "Kratom" or "Mitragyna" => Kratom.
• "7-Hydroxy" => 7-Hydroxy.
• "Nicotine", "Tobacco", "Cigar", "Vape" => Nicotine, nicotineProduct true, hiddenReason "Nicotine products restricted to tobacco site".
Respond ONLY with JSON.`
      },
      {
        role: "user",
        content: `TITLE: ${product.name}\nDESCRIPTION: ${product.description || 'No description'}`
      }
    ]);

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = classificationSchema.parse(JSON.parse(content));

    console.log(`[AI Classifier] Classification result:`, parsed);

    // 1️⃣ Link categories to compliance rules
    const complianceRules = await storage.getAllComplianceRules();
    const matchingRules = complianceRules.filter((rule: any) => 
      parsed.categories.includes(rule.category as any)
    );

    // Create product compliance associations
    for (const rule of matchingRules) {
      try {
        await storage.createProductCompliance({
          productId,
          complianceId: rule.id
        });
        console.log(`[AI Classifier] Assigned compliance rule: ${rule.category}`);
      } catch (error) {
        // Rule might already be assigned, continue
        console.log(`[AI Classifier] Rule ${rule.category} already assigned or error:`, error);
      }
    }

    // 2️⃣ Update product flags  
    const updateData: any = {
      nicotineProduct: parsed.nicotineProduct,
      requiresLabTest: parsed.requiresLabTest,
      visibleOnMainSite: parsed.nicotineProduct ? false : (product.visibleOnMainSite ?? true),
      hiddenReason: parsed.hiddenReason
    };

    await storage.updateProduct(productId, updateData);

    console.log(`[AI Classifier] Updated product flags for ${product.name}`);

    return {
      productId,
      categories: parsed.categories,
      nicotineProduct: parsed.nicotineProduct,
      requiresLabTest: parsed.requiresLabTest,
      hiddenReason: parsed.hiddenReason,
      complianceRulesAssigned: matchingRules.length
    };

  } catch (error) {
    console.error(`[AI Classifier] Error classifying product ${productId}:`, error);
    throw error;
  }
}

export async function bulkClassifyProducts(productIds?: string[], limit = 100) {
  const products = productIds 
    ? await Promise.all(productIds.map(id => storage.getProduct(id)))
    : (await storage.getProducts()).slice(0, limit);
  
  const validProducts = products.filter(p => p !== undefined);
  
  let processed = 0;
  let classified = 0;
  let errors = 0;

  console.log(`[AI Classifier] Starting bulk classification of ${validProducts.length} products`);

  for (const product of validProducts) {
    try {
      const result = await classifyProduct(product.id);
      processed++;
      if (result.categories.some(cat => cat !== 'Other')) {
        classified++;
      }
      
      // Add small delay to avoid rate limiting
      if (processed % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`[AI Classifier] Failed to process product ${product.id}:`, error);
      errors++;
    }
  }

  console.log(`[AI Classifier] Bulk classification complete: ${processed} processed, ${classified} classified, ${errors} errors`);

  return {
    processed,
    classified,
    errors,
    complianceAssigned: classified // Assuming all classified products get compliance
  };
}