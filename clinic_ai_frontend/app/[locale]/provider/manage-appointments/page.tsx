'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CalendarClock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/stores/authStore';
import { apiClient } from '@/lib/api/client';

type VisitRow = {
  visit_id: string;
  patient_id: string;
  patient_name: string;
  scheduled_start?: string;
  chief_complaint?: string;
  status?: string;
};

type DateFilterMode = 'single' | 'range';

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
  if (period === 'PM') hour24 += 12;
  return `${String(hour24).padStart(2, '0')}:${minute}`;
};

const fromTwentyFourToTwelve = (time24: string) => {
  if (!time24) return { hour: '', minute: '', period: '' };
  const [hourStr, minuteStr] = time24.split(':');
  const hour = Number(hourStr);
  if (Number.isNaN(hour) || minuteStr === undefined) {
    return { hour: '', minute: '', period: '' };
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return { hour: String(hour12).padStart(2, '0'), minute: minuteStr, period };
};

const extractScheduledDate = (scheduledStart?: string) => {
  if (!scheduledStart) return '';
  return scheduledStart.split('T')[0] || '';
};

const extractScheduledTime = (scheduledStart?: string) => {
  if (!scheduledStart) return '';
  const timePart = scheduledStart.split('T')[1] || '';
  return timePart.slice(0, 5);
};

export default function ManageAppointmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingVisitId, setSavingVisitId] = useState<string | null>(null);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const loadErrorToastShown = useRef(false);

  const [dateByVisit, setDateByVisit] = useState<Record<string, string>>({});
  const [hourByVisit, setHourByVisit] = useState<Record<string, string>>({});
  const [minuteByVisit, setMinuteByVisit] = useState<Record<string, string>>({});
  const [periodByVisit, setPeriodByVisit] = useState<Record<string, string>>({});
  const [includeWithAppointment, setIncludeWithAppointment] = useState(true);
  const [includeWithoutAppointment, setIncludeWithoutAppointment] = useState(true);
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('single');
  const [singleDateFilter, setSingleDateFilter] = useState('');
  const [rangeStartDate, setRangeStartDate] = useState('');
  const [rangeEndDate, setRangeEndDate] = useState('');
  const [timeFromHour, setTimeFromHour] = useState('');
  const [timeFromMinute, setTimeFromMinute] = useState('');
  const [timeFromPeriod, setTimeFromPeriod] = useState('');
  const [timeToHour, setTimeToHour] = useState('');
  const [timeToMinute, setTimeToMinute] = useState('');
  const [timeToPeriod, setTimeToPeriod] = useState('');
  const singleDateInputRef = useRef<HTMLInputElement | null>(null);
  const rangeStartInputRef = useRef<HTMLInputElement | null>(null);
  const rangeEndInputRef = useRef<HTMLInputElement | null>(null);

  const minAppointmentDate = useMemo(() => toLocalDateString(new Date()), []);
  const maxAppointmentDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 7);
    return toLocalDateString(max);
  }, []);

  const loadVisits = async () => {
    if (!user?.id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const response = await apiClient.getProviderUpcomingVisits(user.id);
      const mapped: VisitRow[] = (response.appointments || []).map((appt) => ({
        visit_id: appt.visit_id || appt.appointment_id,
        patient_id: appt.patient_id,
        patient_name: appt.patient_name || 'Unknown Patient',
        scheduled_start: appt.scheduled_start,
        chief_complaint: appt.chief_complaint,
        status: appt.status,
      }));
      setVisits(mapped);
      const nextDateByVisit: Record<string, string> = {};
      const nextHourByVisit: Record<string, string> = {};
      const nextMinuteByVisit: Record<string, string> = {};
      const nextPeriodByVisit: Record<string, string> = {};

      mapped.forEach((visit) => {
        const date = extractScheduledDate(visit.scheduled_start);
        const time24 = extractScheduledTime(visit.scheduled_start);
        const time12 = fromTwentyFourToTwelve(time24);
        nextDateByVisit[visit.visit_id] = date;
        nextHourByVisit[visit.visit_id] = time12.hour;
        nextMinuteByVisit[visit.visit_id] = time12.minute;
        nextPeriodByVisit[visit.visit_id] = time12.period;
      });

      setDateByVisit(nextDateByVisit);
      setHourByVisit(nextHourByVisit);
      setMinuteByVisit(nextMinuteByVisit);
      setPeriodByVisit(nextPeriodByVisit);
      loadErrorToastShown.current = false;
    } catch (error: any) {
      const detail = error?.response?.data?.detail || 'Failed to load visits';
      setLoadError(detail);
      if (!loadErrorToastShown.current) {
        toast.error(detail);
        loadErrorToastShown.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!user?.id) return;
    loadVisits();
  }, [isAuthenticated, user?.id, router]);

  const filteredVisits = useMemo(() => {
    const timeFromFilter = toTwentyFourHourTime(timeFromHour, timeFromMinute, timeFromPeriod);
    const timeToFilter = toTwentyFourHourTime(timeToHour, timeToMinute, timeToPeriod);
    const treatVisitWiseAsAll = !includeWithAppointment && !includeWithoutAppointment;
    return visits.filter((visit) => {
      const hasAppointment = Boolean(visit.scheduled_start);
      if (!treatVisitWiseAsAll) {
        if (!includeWithAppointment && hasAppointment) return false;
        if (!includeWithoutAppointment && !hasAppointment) return false;
      }

      const scheduledDate = extractScheduledDate(visit.scheduled_start);
      if (dateFilterMode === 'single' && singleDateFilter && scheduledDate !== singleDateFilter) {
        return false;
      }
      if (dateFilterMode === 'range' && (rangeStartDate || rangeEndDate)) {
        if (!scheduledDate) return false;
        if (rangeStartDate && scheduledDate < rangeStartDate) return false;
        if (rangeEndDate && scheduledDate > rangeEndDate) return false;
      }

      const scheduledTime = extractScheduledTime(visit.scheduled_start);
      if (timeFromFilter || timeToFilter) {
        if (!scheduledTime) return false;
        if (timeFromFilter && scheduledTime < timeFromFilter) return false;
        if (timeToFilter && scheduledTime > timeToFilter) return false;
      }
      return true;
    });
  }, [
    visits,
    includeWithAppointment,
    includeWithoutAppointment,
    dateFilterMode,
    singleDateFilter,
    rangeStartDate,
    rangeEndDate,
    timeFromHour,
    timeFromMinute,
    timeFromPeriod,
    timeToHour,
    timeToMinute,
    timeToPeriod,
  ]);

  const handleSchedule = async (event: FormEvent, visitId: string) => {
    event.preventDefault();
    const appointmentDate = dateByVisit[visitId] || '';
    const appointmentTime = toTwentyFourHourTime(
      hourByVisit[visitId] || '',
      minuteByVisit[visitId] || '',
      periodByVisit[visitId] || '',
    );

    if (!appointmentDate || !appointmentTime) {
      toast.error('Please select date and time');
      return;
    }

    setSavingVisitId(visitId);
    try {
      const response = await apiClient.scheduleVisitIntake(visitId, {
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
      });
      setVisits((prev) =>
        prev.map((visit) =>
          visit.visit_id === visitId ? { ...visit, scheduled_start: response.scheduled_start } : visit,
        ),
      );
      if (response.intake_skipped_existing_session) {
        toast('Appointment fixed. Intake already existed for this visit.', { icon: 'ℹ️' });
      } else if (response.whatsapp_triggered) {
        toast.success('Appointment fixed and WhatsApp intake triggered.');
      } else {
        toast.success('Appointment fixed.');
      }
      const selectedTime = fromTwentyFourToTwelve(appointmentTime);
      setDateByVisit((prev) => ({ ...prev, [visitId]: appointmentDate }));
      setHourByVisit((prev) => ({ ...prev, [visitId]: selectedTime.hour }));
      setMinuteByVisit((prev) => ({ ...prev, [visitId]: selectedTime.minute }));
      setPeriodByVisit((prev) => ({ ...prev, [visitId]: selectedTime.period }));
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to fix appointment');
    } finally {
      setSavingVisitId(null);
    }
  };

  const handleResetFilters = () => {
    setIncludeWithAppointment(true);
    setIncludeWithoutAppointment(true);
    setDateFilterMode('single');
    setSingleDateFilter('');
    setRangeStartDate('');
    setRangeEndDate('');
    setTimeFromHour('');
    setTimeFromMinute('');
    setTimeFromPeriod('');
    setTimeToHour('');
    setTimeToMinute('');
    setTimeToPeriod('');
  };

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const input = ref.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }
    input.focus();
  };

  const openDateWiseCalendar = () => {
    if (dateFilterMode === 'single') {
      openPicker(singleDateInputRef);
      return;
    }
    if (dateFilterMode === 'range') {
      if (!rangeStartDate) {
        openPicker(rangeStartInputRef);
        return;
      }
      openPicker(rangeEndInputRef);
      return;
    }
    window.setTimeout(() => openPicker(singleDateInputRef), 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Appointments</h1>
          <p className="text-gray-600 mt-1">Fix missing appointment times before opening visit and intake flow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Visit wise</p>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeWithAppointment}
                onChange={(e) => setIncludeWithAppointment(e.target.checked)}
              />
              Visit with appointment
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeWithoutAppointment}
                onChange={(e) => setIncludeWithoutAppointment(e.target.checked)}
              />
              Visit without appointment
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Date wise</p>
            <Button type="button" variant="outline" className="w-full" onClick={openDateWiseCalendar}>
              Select Date
            </Button>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={dateFilterMode === 'range'}
                onChange={(e) => {
                  const useRange = e.target.checked;
                  setDateFilterMode(useRange ? 'range' : 'single');
                  if (useRange) {
                    setSingleDateFilter('');
                  } else {
                    setRangeStartDate('');
                    setRangeEndDate('');
                  }
                }}
              />
              Use date range
            </label>
            <p className="text-xs text-gray-600">
              {dateFilterMode === 'single'
                ? `Selected: ${singleDateFilter || 'No date selected'}`
                : `Selected: ${rangeStartDate || 'Start'} to ${rangeEndDate || 'End'}`}
            </p>
            <input
              ref={singleDateInputRef}
              type="date"
              value={singleDateFilter}
              onChange={(e) => setSingleDateFilter(e.target.value)}
              className="absolute pointer-events-none opacity-0 h-0 w-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <input
              ref={rangeStartInputRef}
              type="date"
              value={rangeStartDate}
              onChange={(e) => setRangeStartDate(e.target.value)}
              className="absolute pointer-events-none opacity-0 h-0 w-0"
              aria-hidden="true"
              tabIndex={-1}
            />
            <input
              ref={rangeEndInputRef}
              type="date"
              value={rangeEndDate}
              onChange={(e) => setRangeEndDate(e.target.value)}
              className="absolute pointer-events-none opacity-0 h-0 w-0"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Time wise</p>
            <p className="text-xs text-gray-600">From</p>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeFromHour}
                onChange={(e) => setTimeFromHour(e.target.value)}
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, index) => {
                  const value = String(index + 1).padStart(2, '0');
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeFromMinute}
                onChange={(e) => setTimeFromMinute(e.target.value)}
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, index) => {
                  const value = String(index).padStart(2, '0');
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeFromPeriod}
                onChange={(e) => setTimeFromPeriod(e.target.value)}
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <p className="text-xs text-gray-600">To</p>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeToHour}
                onChange={(e) => setTimeToHour(e.target.value)}
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, index) => {
                  const value = String(index + 1).padStart(2, '0');
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeToMinute}
                onChange={(e) => setTimeToMinute(e.target.value)}
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, index) => {
                  const value = String(index).padStart(2, '0');
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={timeToPeriod}
                onChange={(e) => setTimeToPeriod(e.target.value)}
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-600" />
            Manage Visit Appointments
          </CardTitle>
          <CardDescription>Set or update appointment date/time for any visit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-gray-600">Loading visits...</p>}
          {!loading && loadError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{loadError}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={loadVisits}>
                Retry
              </Button>
            </div>
          )}
          {!loading && !loadError && filteredVisits.length === 0 && (
            <p className="text-sm text-gray-600">No visits match the selected filters.</p>
          )}
          {!loading && !loadError && filteredVisits.map((visit) => (
            <div key={visit.visit_id} className="rounded-md border p-3">
              <div className="mb-2">
                <p className="font-medium text-gray-900">{visit.patient_name}</p>
                <p className="text-xs text-gray-600">Visit ID: {visit.visit_id}</p>
                <p className="text-xs text-gray-600">Status: {visit.status || 'open'}</p>
                <p className={`text-xs ${visit.scheduled_start ? 'text-green-700' : 'text-amber-700'}`}>
                  {visit.scheduled_start ? 'Appointment is fixed.' : 'Appointment is not fixed yet.'}
                </p>
                {visit.scheduled_start && (
                  <p className="text-xs text-gray-600">
                    Current appointment: {new Date(visit.scheduled_start).toLocaleString()}
                  </p>
                )}
              </div>
              <form
                className="grid grid-cols-1 md:grid-cols-5 gap-2"
                onSubmit={(e) => handleSchedule(e, visit.visit_id)}
              >
                <Input
                  type="date"
                  min={minAppointmentDate}
                  max={maxAppointmentDate}
                  value={dateByVisit[visit.visit_id] || ''}
                  onChange={(e) => setDateByVisit((prev) => ({ ...prev, [visit.visit_id]: e.target.value }))}
                  required
                />
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={hourByVisit[visit.visit_id] || ''}
                  onChange={(e) => setHourByVisit((prev) => ({ ...prev, [visit.visit_id]: e.target.value }))}
                  required
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const value = String(index + 1).padStart(2, '0');
                    return <option key={value} value={value}>{value}</option>;
                  })}
                </select>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={minuteByVisit[visit.visit_id] || ''}
                  onChange={(e) => setMinuteByVisit((prev) => ({ ...prev, [visit.visit_id]: e.target.value }))}
                  required
                >
                  <option value="">Minute</option>
                  {Array.from({ length: 60 }, (_, index) => {
                    const value = String(index).padStart(2, '0');
                    return <option key={value} value={value}>{value}</option>;
                  })}
                </select>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={periodByVisit[visit.visit_id] || ''}
                  onChange={(e) => setPeriodByVisit((prev) => ({ ...prev, [visit.visit_id]: e.target.value }))}
                  required
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={savingVisitId === visit.visit_id || (visit.status || '').toLowerCase() === 'completed'}
                >
                  {savingVisitId === visit.visit_id
                    ? 'Saving...'
                    : (visit.status || '').toLowerCase() === 'completed'
                    ? 'Completed Visit (Locked)'
                    : visit.scheduled_start
                    ? 'Update Appointment'
                    : 'Fix Appointment'}
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
