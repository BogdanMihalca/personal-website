import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {
    console.log('POST request received');
    const body = await request.json();
    console.log('Request body:', body);
    return NextResponse.json({ message: 'Hello from POST' });
}