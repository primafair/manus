"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, FileText, Shield } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Verify payment and get application data
      fetch(`/api/payments/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setApplication(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error verifying payment:', err);
          setLoading(false);
        });
    }
  }, [sessionId]);

  const handleDownloadPDF = async (type: 'application' | 'invoice') => {
    if (!application) return;
    
    try {
      const response = await fetch(`/api/pdf/${type}/${application.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'application' ? 'sozialversicherungsausweis_antrag.pdf' : 'rechnung.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Zahlung wird überprüft...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Zahlung nicht gefunden</h2>
        <Link href="/">
          <Button>Zur Startseite</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Zahlung erfolgreich!</h1>
        <p className="text-lg text-gray-600">
          Ihr Antrag wurde erfolgreich eingereicht und wird bearbeitet.
        </p>
      </div>

      {/* Application Details */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Antragsdetails</CardTitle>
          <CardDescription>
            Ihre Angaben und der aktuelle Status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Antragsnummer:</span>
              <div className="text-gray-600">#{application.id}</div>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <div className="text-green-600 font-medium">Bezahlt & In Bearbeitung</div>
            </div>
            <div>
              <span className="font-medium">Antragsteller:</span>
              <div className="text-gray-600">{application.firstName} {application.lastName}</div>
            </div>
            <div>
              <span className="font-medium">E-Mail:</span>
              <div className="text-gray-600">{application.email}</div>
            </div>
            <div>
              <span className="font-medium">Zustellungsart:</span>
              <div className="text-gray-600">
                {application.deliveryMethod === 'email' ? 'E-Mail' : 'Briefversand'}
              </div>
            </div>
            <div>
              <span className="font-medium">Bezahlt:</span>
              <div className="text-gray-600">14,99 €</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What happens next */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Was passiert als nächstes?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">E-Mail-Bestätigung versendet</div>
                <div className="text-sm text-gray-600">
                  Sie erhalten eine Bestätigung mit allen Dokumenten an {application.email}
                </div>
              </div>
            </div>

            {application.deliveryMethod === 'postal' && (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Briefversand eingeleitet</div>
                  <div className="text-sm text-gray-600">
                    Ihre Dokumente werden zusätzlich per Post an die angegebene Adresse versendet
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Bearbeitung durch zuständige Stelle</div>
                <div className="text-sm text-gray-600">
                  Ihr Antrag wird an die Deutsche Rentenversicherung weitergeleitet
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600" />
            <span>Dokumente herunterladen</span>
          </CardTitle>
          <CardDescription>
            Laden Sie Ihre Dokumente herunter oder speichern Sie diese für Ihre Unterlagen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleDownloadPDF('application')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Antrag PDF</span>
            </Button>
            <Button 
              onClick={() => handleDownloadPDF('invoice')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Rechnung PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Haben Sie Fragen?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Bei Fragen zu Ihrem Antrag können Sie sich gerne an uns wenden:
          </p>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">E-Mail:</span> support@behoerdenassistent.de</div>
            <div><span className="font-medium">Telefon:</span> +49 (0) 30 12345678</div>
            <div><span className="font-medium">Öffnungszeiten:</span> Mo-Fr 9:00-17:00 Uhr</div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Homepage */}
      <div className="text-center mt-8">
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ErfolgPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BehördenAssistent</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Lädt...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}