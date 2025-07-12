"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Mail, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BehördenAssistent</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Funktionen
              </Link>
              <Link href="#process" className="text-gray-600 hover:text-blue-600 transition-colors">
                Ablauf
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              Digitaler Behördenservice
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Sozialversicherungsausweis
              <span className="block text-blue-600">einfach online beantragen</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sparen Sie sich den Gang zur Behörde. Beantragen Sie Ihren Sozialversicherungsausweis 
              bequem von zu Hause aus - schnell, sicher und rechtsgültig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                <Link href="/antrag">
                  Jetzt beantragen - 14,99 €
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="#process">
                  Wie funktioniert es?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Warum BehördenAssistent?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unser Service kombiniert Komfort, Sicherheit und Effizienz für Ihre Behördengänge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Schnell & Effizient</CardTitle>
                <CardDescription>
                  Formular in 5 Minuten ausfüllen. Keine Wartezeiten, keine Öffnungszeiten.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>100% Sicher</CardTitle>
                <CardDescription>
                  SSL-verschlüsselt, DSGVO-konform. Ihre Daten sind bei uns bestens geschützt.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Rechtsgültig</CardTitle>
                <CardDescription>
                  Offizieller Antrag mit digitaler Signatur. Vollständig rechtsgültig und anerkannt.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Flexible Zustellung</CardTitle>
                <CardDescription>
                  Wählen Sie zwischen E-Mail-Versand oder klassischem Briefversand per Post.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Sofortige Bestätigung</CardTitle>
                <CardDescription>
                  Erhalten Sie umgehend eine Bestätigung und alle relevanten Dokumente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Persönlicher Support</CardTitle>
                <CardDescription>
                  Bei Fragen stehen wir Ihnen gerne zur Verfügung. Kompetent und freundlich.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              So einfach geht's
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In nur wenigen Schritten zu Ihrem Sozialversicherungsausweis.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Formular ausfüllen",
                  description: "Geben Sie Ihre persönlichen Daten ein"
                },
                {
                  step: "2", 
                  title: "Prüfen & bestätigen",
                  description: "Kontrollieren Sie alle Angaben"
                },
                {
                  step: "3",
                  title: "Sicher bezahlen",
                  description: "PayPal oder Kreditkarte - 14,99 €"
                },
                {
                  step: "4",
                  title: "Dokumente erhalten",
                  description: "Per E-Mail oder Brief - Sie wählen"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Bereit für Ihren Antrag?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Starten Sie jetzt und erhalten Sie Ihren Sozialversicherungsausweis in wenigen Minuten.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/antrag">
                Antrag jetzt starten
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">BehördenAssistent</span>
              </div>
              <p className="text-gray-400 mb-4">
                Ihr zuverlässiger Partner für digitale Behördengänge. 
                Schnell, sicher und rechtsgültig.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/antrag" className="hover:text-white transition-colors">Antrag stellen</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Impressum</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Datenschutz</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">AGB</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BehördenAssistent. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}