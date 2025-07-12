import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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

async function readApplications(): Promise<Application[]> {
  try {
    const applications = await sql`SELECT * FROM applications`;
    return applications as Application[];
  } catch (error) {
    console.error('Error reading applications:', error);
    return [];
  }
}

async function writeApplication(application: Application): Promise<void> {
  try {
    await sql`
      INSERT INTO applications (
        id, firstName, lastName, email, street, houseNumber, postalCode, city,
        deliveryMethod, status, createdAt, updatedAt, birthDate, birthPlace, nationality, gender
      ) VALUES (
        ${application.id}, ${application.firstName}, ${application.lastName}, ${application.email}, ${application.street}, ${application.houseNumber}, ${application.postalCode}, ${application.city},
        ${application.deliveryMethod}, ${application.status}, ${application.createdAt}, ${application.updatedAt}, ${application.birthDate}, ${application.birthPlace}, ${application.nationality}, ${application.gender}
      )
    `;
  } catch (error) {
    console.error('Error writing application:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const requiredFields = ['firstName', 'lastName', 'birthDate', 'birthPlace', 'nationality', 'gender', 'street', 'houseNumber', 'postalCode', 'city', 'email', 'deliveryMethod'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    const application: Application = {
      id: uuidv4(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await writeApplication(application);

    return NextResponse.json({ 
      success: true, 
      id: application.id,
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const applications = await readApplications();
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

