'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOUR_STEPS = [
  {
    title: 'Smart Queue',
    description: 'Track today\'s patients, statuses, and token flow in one place.',
  },
  {
    title: 'Consultation Workspace',
    description: 'Capture notes, prescriptions, and visit actions quickly.',
  },
  {
    title: 'Follow-through',
    description: 'Stay on top of labs, follow-ups, and continuity updates.',
  },
  {
    title: 'Automation',
    description: 'Use templates and reminders to reduce repetitive admin work.',
  },
];

export default function WelcomeTourPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const complete = () => {
    localStorage.setItem('welcome_tour_done', 'true');
    localStorage.setItem('clinic_setup_done', 'true');
    router.push('/clinic/dashboard');
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
        <div className="max-w-xl w-full bg-white rounded-xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Tour</h1>
          <p className="text-xs text-slate-500 mb-1">Step {stepIndex + 1} of {TOUR_STEPS.length}</p>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">{TOUR_STEPS[stepIndex].title}</h2>
          <p className="text-slate-600 text-sm mb-6">{TOUR_STEPS[stepIndex].description}</p>
          <div className="space-y-3">
            {stepIndex < TOUR_STEPS.length - 1 ? (
              <Button variant="primary" className="w-full" onClick={() => setStepIndex(stepIndex + 1)}>
                Next
              </Button>
            ) : (
              <Button variant="primary" className="w-full" onClick={complete}>
                Finish tour and go to dashboard
              </Button>
            )}
            {stepIndex > 0 && (
              <Button variant="outline" className="w-full" onClick={() => setStepIndex(stepIndex - 1)}>
                Back
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={complete}>
              Skip tour
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
