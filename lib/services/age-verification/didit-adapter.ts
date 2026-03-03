export interface AgeVerificationProvider {
  /** Creates a verification session URL that the user will be redirected to */
  createSession(userId: string): Promise<string>;
  
  /** Verifies the cryptographic signature of an incoming webhook */
  verifyWebhookSignature(payload: string, signature: string): boolean;
  
  /** Normalizes the provider-specific webhook payload into our common format */
  normalizeWebhookPayload(payload: any): { verified: boolean, inquiryId: string };
}

export class DiditAdapter implements AgeVerificationProvider {
  private apiKey: string;
  private webhookSecret: string;
  private workflowId: string | null = null;
  private apiUrl: string = 'https://verification.didit.me/v3'; 

  constructor() {
    this.apiKey = process.env.DIDIT_API_KEY || '';
    this.webhookSecret = process.env.DIDIT_WEBHOOK_SECRET || '';

    if (!this.apiKey) {
      console.warn('[Age Verification] Warning: DIDIT_API_KEY is not defined.');
    }
  }

  /**
   * Generates or retrieves the UUID for the 'adaptive_age_verification' workflow.
   */
  private async getOrCreateWorkflowId(): Promise<string> {
    if (this.workflowId) return this.workflowId;

    try {
      // 1. Check existing workflows
      const listResponse = await fetch(`${this.apiUrl}/workflows/`, {
        headers: { 'x-api-key': this.apiKey }
      });
      if (!listResponse.ok) {
         const errText = await listResponse.text();
         console.error('[Didit] List workflows error:', errText);
         throw new Error(`Failed to list workflows: ${errText}`);
      }
      const workflows = await listResponse.json();
      const existing = Array.isArray(workflows) ? workflows.find((w: any) => w.workflow_type === 'adaptive_age_verification') : null;
      
      if (existing) {
        this.workflowId = existing.uuid;
        return existing.uuid;
      }

      // 2. Create if not exists
      const createResponse = await fetch(`${this.apiUrl}/workflows/`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_label: "Highway420 Age Gate",
          workflow_type: "adaptive_age_verification",
          is_liveness_enabled: true
        })
      });

      const newWorkflow = await createResponse.json();
      this.workflowId = newWorkflow.uuid;
      return newWorkflow.uuid;
    } catch (error) {
       console.error('[Didit] Failed to sync workflow:', error);
       throw error;
    }
  }

  async createSession(userId: string): Promise<string> {
    try {
      const wId = await this.getOrCreateWorkflowId();

      const response = await fetch(`${this.apiUrl}/session/`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey, // Uses x-api-key, NOT Bearer
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: wId, 
          vendor_data: userId, 
          callback: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/age-verification/success`,
          callback_method: "both"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Didit] Failed to create session:', errorText);
        throw new Error('Failed to create Didit session');
      }

      const data = await response.json();
      return data.url; 
    } catch (error) {
      console.error('[Didit] Session creation error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Didit webhooks are typically signed using HMAC-SHA256 with the webhook secret.
    // We will implement the crypto logic here once we verify their exact header format.
    const crypto = require('crypto');
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );
    } catch {
      return false;
    }
  }

  normalizeWebhookPayload(payload: any): { verified: boolean, inquiryId: string } {
    // Assuming a payload structure based on standard KYC providers.
    // We will refine this exactly to Didit's shape during the Trigger phase testing.
    return {
      verified: payload.status === 'Approved', // Didit uses 'Approved'
      inquiryId: payload.session_id || payload.id
    };
  }

  async getSessionDecision(sessionId: string): Promise<{ verified: boolean, reason?: string }> {
    try {
      if (!this.apiKey) {
        console.warn('[Age Verification] Warning: DIDIT_API_KEY is not defined.');
        return { verified: false, reason: 'Server misconfiguration' };
      }

      const response = await fetch(`${this.apiUrl}/session/${sessionId}/decision/`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Didit] Failed to get session decision:', errorText);
        return { verified: false, reason: 'Session not found or API error' };
      }

      const data = await response.json();
      return { 
        verified: data.status === 'Approved', 
        reason: data.status 
      };
    } catch (error: any) {
      console.error('[Didit] Session decision error:', error);
      return { verified: false, reason: error?.message || 'Unknown error' };
    }
  }
}
