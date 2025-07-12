"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Shield, User, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ApplicationData {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  email: string;
  taxId?: string;
  deliveryMethod: "email" | "postal";
}

export default function AntragPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "deutsch",
    gender: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    email: "",
    taxId: "",
    deliveryMethod: "email"
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Redirect to payment with application ID
        router.push(`/zahlung?applicationId=${result.id}`);
      } else {
        alert('Fehler beim Absenden des Antrags');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Fehler beim Absenden des Antrags');
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.birthDate && formData.birthPlace && formData.nationality && formData.gender;
      case 2:
        return formData.street && formData.houseNumber && formData.postalCode && formData.city;
      case 3:
        return formData.email && formData.deliveryMethod;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BehördenAssistent</span>
            </Link>
            <div className="text-sm text-gray-600">
              Schritt {currentStep} von {totalSteps}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Sozialversicherungsausweis beantragen
              </h1>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep === 1 && <User className="h-5 w-5 text-blue-600" />}
                {currentStep === 2 && <Shield className="h-5 w-5 text-blue-600" />}
                {currentStep === 3 && <Mail className="h-5 w-5 text-blue-600" />}
                {currentStep === 4 && <CreditCard className="h-5 w-5 text-blue-600" />}
                <span>
                  {currentStep === 1 && "Persönliche Daten"}
                  {currentStep === 2 && "Adresse"}
                  {currentStep === 3 && "Kontakt & Zustellung"}
                  {currentStep === 4 && "Zusammenfassung"}
                </span>
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Geben Sie Ihre persönlichen Daten ein"}
                {currentStep === 2 && "Tragen Sie Ihre aktuelle Adresse ein"}
                {currentStep === 3 && "E-Mail und Zustellungsart wählen"}
                {currentStep === 4 && "Prüfen Sie alle Angaben vor dem Absenden"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Personal Data */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Mustermann"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Geburtsdatum *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthPlace">Geburtsort *</Label>
                    <Input
                      id="birthPlace"
                      value={formData.birthPlace}
                      onChange={(e) => updateFormData("birthPlace", e.target.value)}
                      placeholder="Berlin"
                    />
                  </div>

                  <div>
                    <Label>Geschlecht *</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => updateFormData("gender", value)}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Männlich</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Weiblich</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diverse" id="diverse" />
                        <Label htmlFor="diverse">Divers</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="nationality">Staatsangehörigkeit *</Label>
                    <Select value={formData.nationality} onValueChange={(value) => updateFormData("nationality", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deutsch">Deutsch</SelectItem>
                        <SelectItem value="eu">EU-Bürger</SelectItem>
                        <SelectItem value="other">Andere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="street">Straße *</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => updateFormData("street", e.target.value)}
                        placeholder="Musterstraße"
                      />
                    </div>
                    <div>
                      <Label htmlFor="houseNumber">Hausnummer *</Label>
                      <Input
                        id="houseNumber"
                        value={formData.houseNumber}
                        onChange={(e) => updateFormData("houseNumber", e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postleitzahl *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Stadt *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Berlin"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Delivery */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="max@mustermann.de"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxId">Steuer-ID (optional)</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => updateFormData("taxId", e.target.value)}
                      placeholder="12345678901"
                    />
                  </div>

                  <div>
                    <Label>Zustellungsart *</Label>
                    <RadioGroup 
                      value={formData.deliveryMethod} 
                      onValueChange={(value) => updateFormData("deliveryMethod", value as "email" | "postal")}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email-delivery" />
                        <Label htmlFor="email-delivery" className="flex-1">
                          <div>
                            <div className="font-medium">E-Mail (kostenlos)</div>
                            <div className="text-sm text-gray-600">Sofortiger Erhalt der Dokumente per E-Mail</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="postal" id="postal-delivery" />
                        <Label htmlFor="postal-delivery" className="flex-1">
                          <div>
                            <div className="font-medium">Briefversand</div>
                            <div className="text-sm text-gray-600">Zusätzlicher Versand per Post (bereits im Preis enthalten)</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Persönliche Daten</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
                      <div><span className="font-medium">Geburtsdatum:</span> {formData.birthDate}</div>
                      <div><span className="font-medium">Geburtsort:</span> {formData.birthPlace}</div>
                      <div><span className="font-medium">Geschlecht:</span> {formData.gender}</div>
                      <div><span className="font-medium">Staatsangehörigkeit:</span> {formData.nationality}</div>
                      {formData.taxId && <div><span className="font-medium">Steuer-ID:</span> {formData.taxId}</div>}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Adresse</h3>
                    <div className="text-sm">
                      {formData.street} {formData.houseNumber}<br />
                      {formData.postalCode} {formData.city}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Kontakt & Zustellung</h3>
                    <div className="text-sm">
                      <div><span className="font-medium">E-Mail:</span> {formData.email}</div>
                      <div><span className="font-medium">Zustellungsart:</span> {formData.deliveryMethod === 'email' ? 'E-Mail' : 'Briefversand'}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Gesamtpreis:</span>
                      <span className="text-blue-600">14,99 €</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Inkl. Bearbeitung, PDF-Erstellung und {formData.deliveryMethod === 'postal' ? 'Briefversand' : 'E-Mail-Versand'}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Zurück</span>
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <span>Weiter</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <span>Zur Zahlung</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}