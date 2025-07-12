"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Option as PaymentOptions, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    if (applicationId) {
      // Load application data
      fetch(`/api/applications/${applicationId}`)
        .then(res => res.json())
        .then(data => setApplication(data));
    }
  }, [applicationId]);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          amount: 1499, // 14.99 EUR in cents
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Stripe payment error:', error);
      setLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          amount: '14.99',
        }),
      });

      const { approvalUrl } = await response.json();
      window.location.href = approvalUrl;
    } catch (error) {
      console.error('PayPal payment error:', error);
      setLoading(false);
    }
  };

  if (!applicationId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Keine Antragsdaten gefunden</h2>
        <Link href="/antrag">
          <Button>Neuen Antrag starten</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span>Sichere Zahlung</span>
          </CardTitle>
          <CardDescription>
            Wählen Sie Ihre bevorzugte Zahlungsmethode
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Bestellung</h3>
            <div className="flex justify-between items-center">
              <span>Sozialversicherungsausweis Antrag</span>
              <span className="font-semibold">14,99 €</span>
            </div>
            {application && (
              <div className="mt-2 text-sm text-gray-600">
                <div>Antragsteller: {application.firstName} {application.lastName}</div>
                <div>Zustellung: {application.deliveryMethod === 'email' ? 'E-Mail' : 'Briefversand'}</div>
              </div>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">SSL-verschlüsselt & sicher</span>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="font-semibold">Zahlungsmethoden</h3>
            
            {/* Stripe Payment */}
            <Card className="border-2 hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Kreditkarte</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStripePayment}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Lädt...' : 'Bezahlen'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PayPal Payment */}
            <Card className="border-2 hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">PP</span>
                    </div>
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-600">Schnell und sicher mit PayPal</div>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePayPalPayment}
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    {loading ? 'Lädt...' : 'Bezahlen'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Sofortige Bestätigung</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>PDF-Dokumente</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Rechtsgültig</span>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link href="/antrag" className="text-blue-600 hover:underline text-sm">
              ← Zurück zum Antrag
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ZahlungPage() {
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
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}