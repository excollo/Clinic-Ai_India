'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function AccountVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const mobile = searchParams?.get('mobile') || '';
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }
    setIsSubmitting(true);
    localStorage.setItem('account_verified', 'true');
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/clinic-setup?flow=signup');
    }, 400);
  };

  const handleResend = () => {
    toast.success('OTP resent successfully');
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Verification</h1>
          <p className="text-slate-600 text-sm mb-6">
            Enter OTP sent to {mobile || email || 'your registered contact'} to verify your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Verification OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Verify account
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleResend}>
              Resend OTP
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
