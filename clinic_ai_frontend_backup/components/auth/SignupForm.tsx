"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormValues } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed Radix UI Select - using native HTML select for practice type dropdown
import { Check } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

const SPECIALTIES = [
  'General Physician',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'Orthopedics',
  'ENT',
  'Cardiology',
  'Psychiatry',
  'Other',
];

export const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreement: true,
    },
  });

  const password = watch('password', '');
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const fullName = data.fullName.trim();
      const normalizedMobile = data.mobile.replace(/\s+/g, '');
      const normalizedEmail = data.email?.trim() || '';
      const generatedEmail = normalizedEmail || `${normalizedMobile.replace(/[^\d+]/g, '')}@noemail.medgenie.local`;
      const username = `doc_${normalizedMobile.replace(/[^\d]/g, '')}`;

      // Prepare the request payload matching backend UserRegisterRequest schema
      const payload = {
        email: generatedEmail,
        username: username,
        password: data.password,
        full_name: fullName,
        phone: normalizedMobile,
        role: 'doctor', // Provider signup (doctor role)
      };

      console.log('Registering provider:', { ...payload, password: '[REDACTED]' });

      // Call backend through the shared API client (/api proxy aware)
      const result = await apiClient.register(payload);

      // Registration successful
      console.log('Registration successful:', result.user);

      // Store tokens in localStorage
      localStorage.setItem('access_token', result.access_token);
      if (result.refresh_token) {
        localStorage.setItem('refresh_token', result.refresh_token);
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem(
        'doctor_profile',
        JSON.stringify({
          full_name: fullName,
          mobile: normalizedMobile,
          email: normalizedEmail,
          medical_registration_number: data.medicalRegistrationNumber,
          specialty: data.specialty,
        })
      );

      // Update auth store state
      useAuthStore.setState({
        user: result.user,
        isAuthenticated: true,
      });

      // Show success message (brief, non-blocking)
      console.log(`✅ Welcome ${result.user.full_name}! Redirecting to dashboard...`);
      toast.success('Account created successfully. Verify your account to continue.');
      router.push(`/account-verification?email=${encodeURIComponent(generatedEmail)}&mobile=${encodeURIComponent(normalizedMobile)}`);

    } catch (error) {
      console.error('Registration error:', error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 503) {
        toast.error('Signup service is temporarily unavailable. Please try again in a moment.');
        return;
      }
      const detail =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        (error instanceof Error ? error.message : 'Registration failed. Please try again.');
      toast.error(detail);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold">Get Started with MedGenie</CardTitle>
        <CardDescription className="text-lg">Free for 14 days, no credit card required</CardDescription>
        {plan && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-sm px-3 py-1 capitalize">
              Selected Plan: {plan}
            </Badge>
          </div>
        )}
        <div className="pt-4 flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>All Features</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Unlimited Patients</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Doctor Full Name */}
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Dr. Rakesh Mondal"
              {...register('fullName')}
              className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Mobile Phone */}
          <div>
            <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
              Mobile Number (Primary)
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              {...register('mobile')}
              className={`mt-1 ${errors.mobile ? 'border-red-500' : ''}`}
            />
            <p className="text-xs text-gray-500 mt-1">OTP will be sent to this number for verification.</p>
            {errors.mobile && <p className="text-sm text-red-600 mt-1">{errors.mobile.message}</p>}
          </div>

          {/* Email Optional */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="doctor@example.com"
              {...register('email')}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
            />

            {/* Password requirements */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${hasLowercase ? 'bg-forest-600' : 'bg-gray-300'}`} />
                <span className={hasLowercase ? 'text-forest-600' : 'text-gray-500'}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${hasUppercase ? 'bg-forest-600' : 'bg-gray-300'}`} />
                <span className={hasUppercase ? 'text-forest-600' : 'text-gray-500'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${hasNumber ? 'bg-forest-600' : 'bg-gray-300'}`} />
                <span className={hasNumber ? 'text-forest-600' : 'text-gray-500'}>
                  One number
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${hasMinLength ? 'bg-forest-600' : 'bg-gray-300'}`} />
                <span className={hasMinLength ? 'text-forest-600' : 'text-gray-500'}>
                  8 characters min
                </span>
              </div>
            </div>
          </div>

          {/* Medical Registration Number */}
          <div>
            <Label htmlFor="medicalRegistrationNumber" className="text-sm font-medium text-gray-700">
              Medical Registration Number (MCI/State Medical Council)
            </Label>
            <Input
              id="medicalRegistrationNumber"
              type="text"
              placeholder="e.g. MCI-123456"
              {...register('medicalRegistrationNumber')}
              className={`mt-1 ${errors.medicalRegistrationNumber ? 'border-red-500' : ''}`}
            />
            {errors.medicalRegistrationNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.medicalRegistrationNumber.message}</p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">
              Specialty
            </Label>
            <select
              id="specialty"
              {...register('specialty')}
              className={`mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 ${errors.specialty ? 'border-red-500' : ''}`}
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-sm text-red-600 mt-1">{errors.specialty.message}</p>
            )}
          </div>

          {/* Agreement checkbox removed: consent is auto-true in backend */}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating your account...' : 'Continue to OTP Verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
