import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Keine Admin-Berechtigung' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        username: payload.username,
        role: payload.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Ungültiger Token' },
      { status: 401 }
    );
  }
}