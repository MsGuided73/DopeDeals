import { NextRequest, NextResponse } from 'next/server';

/**
 * ZOHO CONNECTION TEST - Verify network connectivity and basic API access
 */

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[],
    overall: 'UNKNOWN' as 'PASS' | 'FAIL' | 'UNKNOWN',
    recommendations: [] as string[]
  };

  try {
    // Test 1: DNS Resolution
    console.log('[Zoho Test] Testing DNS resolution...');
    const dnsTest = await testDNSResolution();
    results.tests.push(dnsTest);

    // Test 2: Basic HTTP connectivity
    console.log('[Zoho Test] Testing HTTP connectivity...');
    const httpTest = await testHTTPConnectivity();
    results.tests.push(httpTest);

    // Test 3: Zoho OAuth endpoint
    console.log('[Zoho Test] Testing OAuth endpoint...');
    const oauthTest = await testOAuthEndpoint();
    results.tests.push(oauthTest);

    // Test 4: Zoho API endpoint (if we have credentials)
    console.log('[Zoho Test] Testing API endpoint...');
    const apiTest = await testAPIEndpoint();
    results.tests.push(apiTest);

    // Determine overall status
    const failedTests = results.tests.filter(test => test.status === 'FAIL');
    const passedTests = results.tests.filter(test => test.status === 'PASS');
    
    if (failedTests.length === 0) {
      results.overall = 'PASS';
      results.recommendations.push('✅ All connectivity tests passed! Zoho sync should work.');
    } else if (passedTests.length > 0) {
      results.overall = 'FAIL';
      results.recommendations.push('⚠️ Some tests failed. Check network configuration.');
    } else {
      results.overall = 'FAIL';
      results.recommendations.push('❌ All tests failed. Major connectivity issue.');
    }

    // Add specific recommendations based on failures
    for (const test of failedTests) {
      if (test.name === 'DNS Resolution') {
        results.recommendations.push('🔧 DNS Issue: Check your DNS settings or try using 8.8.8.8');
      }
      if (test.name === 'HTTP Connectivity') {
        results.recommendations.push('🔧 Network Issue: Check firewall, proxy, or VPN settings');
      }
      if (test.name === 'OAuth Endpoint') {
        results.recommendations.push('🔧 Zoho OAuth Issue: Verify Zoho service status');
      }
      if (test.name === 'API Endpoint') {
        results.recommendations.push('🔧 API Issue: Check credentials or Zoho API status');
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('[Zoho Test] Unexpected error:', error);
    results.overall = 'FAIL';
    results.tests.push({
      name: 'Connection Test',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: 0
    });
    results.recommendations.push('❌ Unexpected error during testing. Check server logs.');

    return NextResponse.json(results, { status: 500 });
  }
}

async function testDNSResolution(): Promise<any> {
  const startTime = Date.now();

  try {
    // Test DNS resolution by making a simple request to correct domain
    const response = await fetch('https://accounts.zoho.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    return {
      name: 'DNS Resolution',
      status: 'PASS',
      message: 'Successfully resolved accounts.zoho.com',
      duration: Date.now() - startTime,
      details: {
        status: response.status,
        statusText: response.statusText
      }
    };
  } catch (error: any) {
    return {
      name: 'DNS Resolution',
      status: 'FAIL',
      error: error.message,
      duration: Date.now() - startTime,
      details: {
        errorCode: error.code,
        errorType: error.name
      }
    };
  }
}

async function testHTTPConnectivity(): Promise<any> {
  const startTime = Date.now();

  try {
    // Test basic HTTP connectivity to Zoho API
    const response = await fetch('https://www.zohoapis.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });

    return {
      name: 'HTTP Connectivity',
      status: 'PASS',
      message: 'Successfully connected to www.zohoapis.com',
      duration: Date.now() - startTime,
      details: {
        status: response.status,
        statusText: response.statusText
      }
    };
  } catch (error: any) {
    return {
      name: 'HTTP Connectivity',
      status: 'FAIL',
      error: error.message,
      duration: Date.now() - startTime,
      details: {
        errorCode: error.code,
        errorType: error.name
      }
    };
  }
}

async function testOAuthEndpoint(): Promise<any> {
  const startTime = Date.now();

  try {
    // Use correct OAuth endpoint (no region prefix)
    const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;

    // Test OAuth endpoint with invalid credentials (should return 400, not network error)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=invalid',
      signal: AbortSignal.timeout(10000)
    });

    // Any HTTP response (even error) means connectivity works
    return {
      name: 'OAuth Endpoint',
      status: 'PASS',
      message: 'OAuth endpoint is reachable',
      duration: Date.now() - startTime,
      details: {
        status: response.status,
        statusText: response.statusText,
        note: 'Expected 400/401 error - this confirms endpoint is working'
      }
    };
  } catch (error: any) {
    return {
      name: 'OAuth Endpoint',
      status: 'FAIL',
      error: error.message,
      duration: Date.now() - startTime,
      details: {
        errorCode: error.code,
        errorType: error.name
      }
    };
  }
}

async function testAPIEndpoint(): Promise<any> {
  const startTime = Date.now();

  try {
    const orgId = process.env.ZOHO_ORGANIZATION_ID;

    if (!orgId) {
      return {
        name: 'API Endpoint',
        status: 'SKIP',
        message: 'No organization ID configured - skipping API test',
        duration: Date.now() - startTime
      };
    }

    // Test API endpoint without auth (should return 401, not network error)
    const apiUrl = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&per_page=1`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    });

    // Any HTTP response (even 401) means connectivity works
    return {
      name: 'API Endpoint',
      status: 'PASS',
      message: 'API endpoint is reachable',
      duration: Date.now() - startTime,
      details: {
        status: response.status,
        statusText: response.statusText,
        note: 'Expected 401 error - this confirms API endpoint is working'
      }
    };
  } catch (error: any) {
    return {
      name: 'API Endpoint',
      status: 'FAIL',
      error: error.message,
      duration: Date.now() - startTime,
      details: {
        errorCode: error.code,
        errorType: error.name
      }
    };
  }
}
