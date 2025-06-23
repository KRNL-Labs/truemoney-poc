import express, { Request, Response } from 'express';
import cors from 'cors';
import { body, param, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Types based on Chainalysis API documentation
interface RiskAssessment {
  address: string;
  risk: 'Low' | 'Medium' | 'High' | 'Severe';
  riskReason?: string;
  addressType: 'PRIVATE_WALLET' | 'LIQUIDITY_POOL';
  cluster?: {
    category: string;
    name: string;
  };
  addressIdentifications: Array<{
    category: string;
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
    addresses?: string[];
  }>;
  exposures: Array<{
    category: string;
    categoryId: string;
    value: number;
    valueUsd?: number;
  }>;
  triggers: Array<{
    category: string;
    categoryId: string;
    value: number;
    valueUsd?: number;
  }>;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
  poolMetadata?: {
    tokenA: string;
    tokenB: string;
    protocol: string;
  };
}

// Mock data generator for demonstration
function generateMockRiskAssessment(address: string): RiskAssessment {
  const riskLevels: Array<'Low' | 'Medium' | 'High' | 'Severe'> = ['Low', 'Medium', 'High', 'Severe'];
  const categories = ['exchange', 'fee', 'unnamed service', 'defi', 'gambling', 'mixer'];
  
  // Simple hash-based pseudo-randomization for consistent results
  const hash = address.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const risk = riskLevels[Math.abs(hash) % riskLevels.length];
  const numExposures = (Math.abs(hash) % 3) + 1;
  
  const exposures = Array.from({ length: numExposures }, (_, i) => ({
    category: categories[(Math.abs(hash) + i) % categories.length],
    categoryId: `cat_${(Math.abs(hash) + i) % 1000}`,
    value: Math.abs((hash * (i + 1)) % 1000000) / 100,
    valueUsd: Math.abs((hash * (i + 1)) % 1000000) / 100 * 2000 // Mock USD conversion
  }));

  return {
    address,
    risk,
    riskReason: risk !== 'Low' ? `Address has ${risk.toLowerCase()} risk exposure to ${exposures[0].category}` : undefined,
    addressType: 'PRIVATE_WALLET',
    addressIdentifications: [],
    exposures,
    triggers: risk === 'High' || risk === 'Severe' ? [exposures[0]] : [],
    status: 'COMPLETE'
  };
}

// Validation middleware
const validateAddress = [
  param('address')
    .isLength({ min: 40, max: 42 })
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum address format')
];

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main endpoint - following Chainalysis API format
app.get('/api/risk/v2/entities/:address', validateAddress, (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid address format',
        details: errors.array()
      });
    }

    const { address } = req.params;
    const riskAssessment = generateMockRiskAssessment(address);
    
    res.json(riskAssessment);
  } catch (error) {
    console.error('Error processing risk assessment:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process risk assessment'
    });
  }
});

// Alternative endpoint for POST requests (following KRNL patterns)
app.post('/api/wallet/analyze', [
  body('address')
    .isLength({ min: 40, max: 42 })
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum address format')
], (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid request',
        details: errors.array()
      });
    }

    const { address } = req.body;
    const riskAssessment = generateMockRiskAssessment(address);
    
    res.json(riskAssessment);
  } catch (error) {
    console.error('Error processing wallet analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process wallet analysis'
    });
  }
});

// Bulk analysis endpoint
app.post('/api/wallet/analyze/bulk', [
  body('addresses')
    .isArray({ min: 1, max: 100 })
    .withMessage('Addresses must be an array with 1-100 items'),
  body('addresses.*')
    .isLength({ min: 40, max: 42 })
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Each address must be a valid Ethereum address')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid request',
        details: errors.array()
      });
    }

    const { addresses } = req.body;
    const results = addresses.map((address: string) => ({
      address,
      analysis: generateMockRiskAssessment(address)
    }));
    
    res.json({
      results,
      totalAnalyzed: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing bulk analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process bulk analysis'
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wallet Analysis Server running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🔍 Risk assessment endpoint: http://localhost:${PORT}/api/risk/v2/entities/{address}`);
  console.log(`📝 Analysis endpoint: http://localhost:${PORT}/api/wallet/analyze`);
});

export default app;