import { Request, Response } from 'express';
import { fixRLSPolicies } from '../utils/rls-fix-simple';

export async function fixRLS(req: Request, res: Response) {
  try {
    console.log('🔧 Admin request to fix RLS policies...');
    
    await fixRLSPolicies();
    
    res.json({
      success: true,
      message: 'RLS policy fix completed'
    });
    
  } catch (error) {
    console.error('❌ Error fixing RLS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fix RLS policies',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}