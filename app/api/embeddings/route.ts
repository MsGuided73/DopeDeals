import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Simple in-memory cache for embeddings
const embeddingCache = new Map<string, { embedding: number[], timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // Check cache first
    const cached = embeddingCache.get(trimmedText);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({ embedding: cached.embedding });
    }

    // Generate new embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: trimmedText,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;

    // Validate embedding length (text-embedding-3-small should be 1536 dimensions)
    if (!Array.isArray(embedding) || embedding.length !== 1536) {
      console.error('Invalid embedding dimensions:', embedding.length);
      return NextResponse.json(
        { error: 'Invalid embedding generated' },
        { status: 500 }
      );
    }

    // Cache the result
    embeddingCache.set(trimmedText, {
      embedding,
      timestamp: Date.now()
    });

    // Clean up old cache entries (simple cleanup)
    if (embeddingCache.size > 1000) {
      const cutoff = Date.now() - CACHE_DURATION;
      for (const [key, value] of embeddingCache.entries()) {
        if (value.timestamp < cutoff) {
          embeddingCache.delete(key);
        }
      }
    }

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('Embedding API error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed with embedding service.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate embedding. Please try again.' },
      { status: 500 }
    );
  }
}
