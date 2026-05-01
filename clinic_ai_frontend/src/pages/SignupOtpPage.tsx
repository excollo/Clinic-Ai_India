import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function maskIndianMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, '')
  if (digits.length < 6) return mobile
  const prefix = digits.slice(0, 2)
  const suffix = digits.slice(-3)
  return `+91 ${prefix}*** *${suffix}`
}

function SignupOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mobileFromState = (location.state as { mobile?: string } | null)?.mobile ?? '+91 98*** *210'
  const maskedMobile = useMemo(() => maskIndianMobile(mobileFromState), [mobileFromState])
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '', '', ''])

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1)
    setOtpDigits((prev) => {
      const next = [...prev]
      next[index] = sanitized
      return next
    })
  }

  return (
    <div className="bg-background font-manrope text-on-background min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-teal-600">MedGenie</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm font-semibold">Support</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[1280px] flex flex-col items-center">
          <div className="w-full max-w-[480px] mb-6">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Onboarding Progress</span>
              <span className="text-xs font-semibold text-on-surface-variant">Step 2 of 5</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-primary transition-all duration-500 ease-out"></div>
            </div>
          </div>

          <div className="w-full max-w-[560px] bg-white rounded-xl shadow-card p-8 border border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <h1 className="text-4xl font-bold text-on-surface text-center mb-1">Verify your identity</h1>
            <p className="text-base text-on-surface-variant text-center max-w-[380px] mb-8">
              We&apos;ve sent a 6-digit verification code to{' '}
              <span className="font-bold text-on-surface">{maskedMobile}</span>. Please enter it below.
            </p>

            <div className="grid grid-cols-6 gap-3 w-full mb-8">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  className="w-full aspect-square text-center text-2xl font-bold bg-surface-container-low border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  maxLength={1}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-1 mb-8">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-sm font-semibold">
                  Resend code in <span className="text-primary font-bold">01:54</span>
                </span>
              </div>
              <button className="text-sm font-semibold text-slate-400 cursor-not-allowed transition-all" disabled type="button">
                Resend OTP
              </button>
            </div>

            <button
              className="w-full bg-primary text-on-primary py-4 rounded-lg text-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="button"
              onClick={() => navigate('/clinic-setup')}
            >
              <span>Verify &amp; Continue</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <button
              className="mt-6 text-sm font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1"
              type="button"
              onClick={() => navigate('/signup')}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Edit Phone Number
            </button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.05)]">
        <div className="text-sm text-slate-600">© 2024 MedGenie. Empathetic Precision in Healthcare.</div>
        <div className="flex gap-6">
          <a className="text-sm text-slate-500 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Privacy Policy</a>
          <a className="text-sm text-slate-500 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Terms of Service</a>
          <a className="text-sm text-slate-500 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  )
}

export default SignupOtpPage
