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

function generateInvoicePDF(application: any): string {
  const invoiceNumber = `RG-${application.id.substring(0, 8).toUpperCase()}`;
  const invoiceDate = application.paidAt ? new Date(application.paidAt) : new Date();
  
  const pdfContent = `
RECHNUNG

BehördenAssistent GmbH
Musterstraße 123
12345 Berlin
Deutschland

Steuer-Nr: 123/456/78901
USt-IdNr: DE123456789

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECHNUNGSADRESSE:
${application.firstName} ${application.lastName}
${application.street} ${application.houseNumber}
${application.postalCode} ${application.city}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rechnungsnummer: ${invoiceNumber}
Rechnungsdatum: ${invoiceDate.toLocaleDateString('de-DE')}
Leistungsdatum: ${invoiceDate.toLocaleDateString('de-DE')}
Zahlungsart: ${application.paymentMethod === 'stripe' ? 'Kreditkarte' : 'PayPal'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEISTUNGEN:

Pos. | Beschreibung                           | Menge | Preis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1   | Bearbeitung Sozialversicherungsausweis |   1   | 14,99 €
     | - Antragsbearbeitung                   |       |
     | - PDF-Erstellung                       |       |
     | - ${application.deliveryMethod === 'email' ? 'E-Mail-Versand' : 'Briefversand'}                    |       |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Zwischensumme:                                     14,99 €
Mehrwertsteuer (19%):                               2,85 €
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GESAMTBETRAG:                                      17,84 €

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vielen Dank für Ihr Vertrauen!

Diese Rechnung wurde elektronisch erstellt und ist ohne Unterschrift gültig.
  `;

  return pdfContent;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication for invoice PDF access
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

    // Generate invoice PDF content
    const pdfContent = generateInvoicePDF(application);
    
    // Convert to blob for download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const buffer = await blob.arrayBuffer();

    const invoiceNumber = `RG-${application.id.substring(0, 8).toUpperCase()}`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rechnung_${invoiceNumber}.pdf"`
      }
    });

  } catch (error) {
    console.error('Invoice PDF generation error:', error);
    return NextResponse.json(
      { error: 'Invoice PDF generation failed' },
      { status: 500 }
    );
  }
}