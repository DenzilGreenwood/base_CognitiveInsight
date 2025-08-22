import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get Firebase ID token from request headers
    const authHeader = request.headers.get('authorization');
    console.log('API route received auth header:', authHeader?.substring(0, 30) + '...');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    
    const idToken = authHeader.substring(7);
    console.log('Extracted token:', idToken?.substring(0, 20) + '...');
    
    // In development, proxy to the deployed Firebase function
    // In production, this will be handled by Firebase hosting rewrites
    const functionUrl = process.env.NODE_ENV === 'development' 
      ? 'https://us-central1-cognitiveinsight-j7xwb.cloudfunctions.net/simGenerate'
      : '/api/sim/generate'; // This shouldn't be called in production due to rewrites
    
    if (process.env.NODE_ENV === 'development') {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`, // Forward the Firebase token
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Firebase function error:', errorText);
        return NextResponse.json(
          { error: `Function error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // In production, this shouldn't be reached due to Firebase rewrites
      return NextResponse.json(
        { error: 'This endpoint should be handled by Firebase rewrites in production' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
