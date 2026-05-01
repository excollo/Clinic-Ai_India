'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.forgotPassword(normalizedEmail);
      toast.success(response?.message || response?.detail || 'If this account exists, reset instructions were sent.');
      router.push(`/forgot-password/otp-verification?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 405) {
        toast.error('Password reset is not enabled yet. Please contact clinic admin for manual reset.');
        return;
      }
      const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(detail || 'Failed to request password reset');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset password</h1>
          <p className="text-slate-600 text-sm mb-6">
            Enter your account email and we will send an OTP to continue password reset.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@clinic.com"
              autoComplete="email"
              required
            />
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Send OTP
            </Button>
          </form>

          <Link href="/login" className="block mt-5">
            <Button variant="outline" className="w-full">
              Return to login
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
