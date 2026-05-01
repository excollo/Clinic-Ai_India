'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function ClinicSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams?.get('flow') || 'first-login';
  const [clinicName, setClinicName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [opdHours, setOpdHours] = useState('');
  const [consultationLanguages, setConsultationLanguages] = useState('English, Hindi');
  const [tokenPrefix, setTokenPrefix] = useState('OPD-');
  const [logoName, setLogoName] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!clinicName.trim() || !city.trim() || !stateName.trim() || !pincode.trim() || !opdHours.trim()) {
      toast.error('Please fill all required clinic setup fields');
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem('clinic_setup_done', 'true');
    localStorage.setItem(
      'clinic_setup_data',
      JSON.stringify({
        clinicName,
        addressLine,
        city,
        state: stateName,
        pincode,
        opdHours,
        consultationLanguages,
        tokenPrefix,
        clinicLogo: logoName || null,
        doctorSignature: signatureName || null,
      })
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (flow === 'signup') {
        router.push('/abdm-setup');
      } else {
        router.push('/clinic/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-sand-50 flex flex-col">
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-forest rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MedGenie</span>
          </Link>
          <Link href="/login" className="text-sm text-forest-600 hover:text-forest-700 font-medium">
            Back to sign in
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Clinic Setup</h1>
          <p className="text-slate-600 text-sm mb-6">Configure your clinic basics to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Clinic Name"
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Clinic name"
              required
            />
            <Input
              label="Clinic Address"
              type="text"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Street / locality"
            />
            <Input
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
            <Input
              label="State"
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="State"
              required
            />
            <Input
              label="Pincode"
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="6-digit pincode"
              required
            />
            <Input
              label="OPD Hours"
              type="text"
              value={opdHours}
              onChange={(e) => setOpdHours(e.target.value)}
              placeholder="Mon-Sat, 9:00 AM - 6:00 PM"
              required
            />
            <Input
              label="Default Consultation Language(s)"
              type="text"
              value={consultationLanguages}
              onChange={(e) => setConsultationLanguages(e.target.value)}
              placeholder="English, Hindi"
            />
            <Input
              label="Token Prefix"
              type="text"
              value={tokenPrefix}
              onChange={(e) => setTokenPrefix(e.target.value)}
              placeholder="OPD-"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Clinic Logo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoName(e.target.files?.[0]?.name || '')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Doctor Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSignatureName(e.target.files?.[0]?.name || '')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Continue
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
