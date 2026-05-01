'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function WhatsAppSetupPage() {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleConnect = () => {
    if (!whatsappNumber.trim()) {
      toast.error('Please enter WhatsApp Business number or skip for now');
      return;
    }
    localStorage.setItem('whatsapp_setup', JSON.stringify({ connected: true, number: whatsappNumber.trim() }));
    router.push('/welcome-tour');
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
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Setup (Optional)</h1>
          <p className="text-slate-600 text-sm mb-6">
            Connect WhatsApp Business number or skip to use platform default.
          </p>
          <Input
            label="WhatsApp Business Number"
            type="tel"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+91 98765 43210"
          />
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleConnect}>
              Enable WhatsApp and continue
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                localStorage.setItem('whatsapp_setup', JSON.stringify({ connected: false, mode: 'platform-default' }));
                router.push('/welcome-tour');
              }}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
