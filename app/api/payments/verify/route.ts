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

async function readApplicationById(id: string): Promise<Application | undefined> {
  try {
    const [application] = await sql`SELECT * FROM applications WHERE id = ${id}`;
    return application as Application;
  } catch (error) {
    console.error('Error reading application by ID:', error);
    return undefined;
  }
}

async function updateApplication(application: Application): Promise<void> {
  try {
    await sql`
      UPDATE applications
      SET
        status = ${application.status},
        "paidAt" = ${application.paidAt},
        "paymentMethod" = ${application.paymentMethod},
        "paymentId" = ${application.paymentId},
        amount = ${application.amount},
        "updatedAt" = ${application.updatedAt}
      WHERE id = ${application.id}
    `;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const applicationId = searchParams.get('application_id');
    const paypalOrderId = searchParams.get('paypal_order_id');
    
    if (!sessionId && !paypalOrderId) {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 400 }
      );
    }

    let application: Application | undefined;

    if (applicationId) {
      application = await readApplicationById(applicationId);
    } else {
      // In a real implementation, you'd find by payment session/order ID
      // For now, we'll assume the application ID is always provided or find a way to link it
      // This part needs careful consideration for a robust solution
      // For demo purposes, we might need to fetch the latest application or rely on applicationId
      console.warn('No applicationId provided, relying on paymentId lookup which is not fully implemented.');
      // Placeholder: In a real scenario, you'd query the DB using paypalOrderId or sessionId
      // For now, let's assume we get the applicationId from the payment gateway callback or session
      // Since we don't have a direct link from paymentId to application in DB, this might fail.
      // Let's try to fetch by paymentId if it exists in the DB, assuming it's unique.
      if (paypalOrderId) {
        const [appByPaymentId] = await sql`SELECT * FROM applications WHERE "paymentId" = ${paypalOrderId}`;
        application = appByPaymentId as Application;
      }
    }
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update application status to paid
    const updatedApplication: Application = {
      ...application,
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod: sessionId ? 'stripe' : 'paypal',
      paymentId: sessionId || paypalOrderId,
      amount: 14.99,
      updatedAt: new Date().toISOString()
    };

    await updateApplication(updatedApplication);

    // In a real implementation, here you would:
    // 1. Generate PDF documents
    // 2. Send email with attachments
    // 3. If postal delivery selected, send to eBrief.de API
    
    // Simulate email sending
    await simulateEmailSending(updatedApplication);
    
    // Simulate eBrief API call if postal delivery
    if (updatedApplication.deliveryMethod === 'postal') {
      await simulateEBriefSending(updatedApplication);
    }

    return NextResponse.json(updatedApplication);

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

async function simulateEmailSending(application: Application): Promise<boolean> {
  // In a real implementation, you would use a service like Nodemailer
  console.log(`📧 Sending email to ${application.email} with PDF attachments`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
}

async function simulateEBriefSending(application: Application): Promise<{ trackingId: string; status: string }> {
  // In a real implementation, you would call eBrief.de API
  console.log(`📮 Sending documents via eBrief.de to:`);
  console.log(`   ${application.firstName} ${application.lastName}`);
  console.log(`   ${application.street} ${application.houseNumber}`);
  console.log(`   ${application.postalCode} ${application.city}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    trackingId: `EB${Math.random().toString(36).substring(2).toUpperCase()}`,
    status: 'sent'
  };
}

