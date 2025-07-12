import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  deliveryMethod: 'email' | 'postal';
  status: string;
  createdAt: string;
  updatedAt: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  paidAt?: string | null;
  paymentMethod?: string;
  paymentId?: string | null;
  amount?: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [application] = await sql`SELECT * FROM applications WHERE id = ${params.id}`;
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


