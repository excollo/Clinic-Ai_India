'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toTwentyFourHourTime = (hour12: string, minute: string, period: string) => {
  if (!hour12 || !minute || !period) return '';
  const parsedHour = Number(hour12);
  if (Number.isNaN(parsedHour)) return '';
  let hour24 = parsedHour % 12;
  if (period === 'PM') {
    hour24 += 12;
  }
  return `${String(hour24).padStart(2, '0')}:${minute}`;
};

export default function RegisteredPatientsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    patient_id: string;
    visit_id: string;
    existing_patient: boolean;
    whatsapp_triggered?: boolean;
    pending_schedule_for_intake?: boolean;
  } | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('IND');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi' | 'en_US'>('en_US');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentHour, setAppointmentHour] = useState('');
  const [appointmentMinute, setAppointmentMinute] = useState('');
  const [appointmentPeriod, setAppointmentPeriod] = useState('');

  const minAppointmentDate = toLocalDateString(new Date());
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxAppointmentDate = toLocalDateString(maxDateObj);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!['doctor', 'nurse', 'admin', 'staff', 'super_admin'].includes(user?.role || '')) {
      toast.error('Access denied');
      router.push('/login');
      return;
    }

  }, [isAuthenticated, user?.role, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const payload = {
        name: `${firstName} ${lastName}`.trim(),
        phone_number: phoneNumber.trim(),
        age: Number(age),
        gender: gender.trim(),
        preferred_language: preferredLanguage,
        travelled_recently: false,
        consent,
        workflow_type: 'schedule',
        country: country.trim(),
        emergency_contact: emergencyContact.trim(),
        address: address.trim(),
        appointment_date: appointmentDate || undefined,
        appointment_time: toTwentyFourHourTime(appointmentHour, appointmentMinute, appointmentPeriod) || undefined,
      };

      const response = await apiClient.registerPatient(payload);
      setResult(response);
      const base = response.existing_patient ? 'Existing patient found. New visit created.' : 'New patient and visit created.';
      if (response.pending_schedule_for_intake) {
        toast.success(`${base} Appointment not fixed yet.`);
      } else if (response.whatsapp_triggered) {
        toast.success(`${base} WhatsApp intake started.`);
      } else {
        toast.success(base);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to register patient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Appointment</h1>
          <p className="text-gray-600 mt-1">Register patient and create visit (no chief complaint here)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add Appointment
          </CardTitle>
          <CardDescription>POST `/api/patients/register`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Patient First Name" required />
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Patient Last Name" />
              <Input
                type="number"
                min={0}
                max={130}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Patient Age"
                required
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Patient Mobile Number"
                required
              />
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Patient Country" />
              <Input value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'hi' | 'en_US')} placeholder="Patient Language" />
              <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Emergency Contact (optional)" />
            </div>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address (optional)"
            />
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                Consent
              </label>
            </div>
            <p className="text-sm text-gray-600">Appointment (optional). If you skip date and time, this visit remains unscheduled and can be fixed later from Manage Appointments.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                type="date"
                min={minAppointmentDate}
                max={maxAppointmentDate}
                value={appointmentDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  if (!selectedDate) {
                    setAppointmentDate('');
                    return;
                  }
                  if (selectedDate < minAppointmentDate || selectedDate > maxAppointmentDate) {
                    toast.error('Appointment date must be between today and next 7 days');
                    return;
                  }
                  setAppointmentDate(selectedDate);
                }}
                placeholder="Appointment Date"
              />
              <select
                value={appointmentHour}
                onChange={(e) => setAppointmentHour(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, index) => {
                  const value = String(index + 1).padStart(2, '0');
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <select
                value={appointmentMinute}
                onChange={(e) => setAppointmentMinute(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, index) => {
                  const value = String(index).padStart(2, '0');
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <select
                value={appointmentPeriod}
                onChange={(e) => setAppointmentPeriod(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Patient / Visit'}
            </Button>
          </form>

          {result && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p><strong>patient_id:</strong> {result.patient_id}</p>
              <p><strong>visit_id:</strong> {result.visit_id}</p>
              <p><strong>existing_patient:</strong> {String(result.existing_patient)}</p>
              <p><strong>whatsapp_triggered:</strong> {String(result.whatsapp_triggered ?? false)}</p>
              <p><strong>pending_schedule_for_intake:</strong> {String(result.pending_schedule_for_intake ?? false)}</p>
              {result.pending_schedule_for_intake && (
                <p className="mt-2 font-medium text-amber-800">Appointment is not fixed for this visit.</p>
              )}
            </div>
          )}

          {result?.pending_schedule_for_intake && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 space-y-3">
              <p className="text-sm font-medium text-amber-900">Appointment is pending for this visit.</p>
              <p className="text-xs text-amber-800">Go to the separate scheduling page to fix appointment and trigger intake.</p>
              <Link href="/provider/manage-appointments">
                <Button variant="outline" className="border-amber-300 text-amber-900">
                  Go To Manage Appointments
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
