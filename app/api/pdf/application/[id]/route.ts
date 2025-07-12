import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

async function readApplications() {
  try {
    if (existsSync(APPLICATIONS_FILE)) {
      const data = await readFile(APPLICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading applications:', error);
  }
  return [];
}

function generateApplicationPDF(application: any): string {
  // In a real implementation, you would use a PDF library like puppeteer, jsPDF, or PDFKit
  // For this demo, we'll return a simple text-based PDF content simulation
  
  const pdfContent = `
ANTRAG AUF SOZIALVERSICHERUNGSAUSWEIS

Antragsnummer: ${application.id}
Datum: ${new Date(application.createdAt).toLocaleDateString('de-DE')}

PERSÖNLICHE DATEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${application.firstName} ${application.lastName}
Geburtsdatum: ${new Date(application.birthDate).toLocaleDateString('de-DE')}
Geburtsort: ${application.birthPlace}
Geschlecht: ${application.gender}
Staatsangehörigkeit: ${application.nationality}
${application.taxId ? `Steuer-ID: ${application.taxId}` : ''}

ADRESSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${application.street} ${application.houseNumber}
${application.postalCode} ${application.city}

KONTAKT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

E-Mail: ${application.email}
Zustellungsart: ${application.deliveryMethod === 'email' ? 'E-Mail' : 'Briefversand'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hiermit beantrage ich die Ausstellung eines neuen Sozialversicherungsausweises.

Mit freundlichen Grüßen
${application.firstName} ${application.lastName}

Diese Unterlage wurde elektronisch erstellt und ist ohne Unterschrift gültig.
  `;

  return pdfContent;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication for PDF access
    const token = request.cookies.get('admin-token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const applications = await readApplications();
    const application = applications.find((app: any) => app.id === params.id);
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status === 'pending') {
      return NextResponse.json(
        { error: 'Application not yet paid' },
        { status: 403 }
      );
    }

    // Generate PDF content
    const pdfContent = generateApplicationPDF(application);
    
    // Convert to blob for download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const buffer = await blob.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="antrag_${application.lastName}_${application.firstName}.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}