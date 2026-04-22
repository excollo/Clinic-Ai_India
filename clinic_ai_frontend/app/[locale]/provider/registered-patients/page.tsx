'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisteredPatientsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ patient_id: string; visit_id: string; existing_patient: boolean } | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workflowType, setWorkflowType] = useState('schedule');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('US');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi' | 'en_US'>('en');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [travelledRecently, setTravelledRecently] = useState(false);
  const [consent, setConsent] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [visitType, setVisitType] = useState('');

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
        travelled_recently: travelledRecently,
        consent,
        workflow_type: workflowType,
        country: country.trim(),
        emergency_contact: emergencyContact.trim(),
        address: address.trim(),
        appointment_date: appointmentDate || undefined,
        appointment_time: appointmentTime || undefined,
        visit_type: visitType || undefined,
      };

      const response = await apiClient.registerPatient(payload);
      setResult(response);
      toast.success(response.existing_patient ? 'Existing patient found. New visit created.' : 'New patient and visit created.');
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
        <Link href="/provider/visits/new">
          <Button variant="outline">Go to Visit Picker</Button>
        </Link>
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
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Patient Mobile Number"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={workflowType} onChange={(e) => setWorkflowType(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="schedule">Schedule</option>
              </select>
              <Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" required />
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Patient First Name" required />
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Patient Last Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                type="number"
                min={0}
                max={130}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Patient Age"
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
                  checked={travelledRecently}
                  onChange={(e) => setTravelledRecently(e.target.checked)}
                />
                Recently Travelled
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                Consent
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} placeholder="Appointment Date" />
              <Input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} placeholder="Appointment Time" />
              <Input value={visitType} onChange={(e) => setVisitType(e.target.value)} placeholder="Visit Type" />
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
