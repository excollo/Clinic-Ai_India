import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { verifyForgotPasswordOtp } from '../services/authService'

function ForgotPasswordOtpPage() {
  const location = useLocation()
  const identifier = useMemo(
    () => ((location.state as { identifier?: string } | null)?.identifier ?? '').trim(),
    [location.state],
  )
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1)
    setOtpDigits((prev) => {
      const next = [...prev]
      next[index] = sanitized
      return next
    })
  }

  const handleVerify = async () => {
    setError('')
    setSuccess('')
    if (!identifier) {
      setError('Missing email/phone. Please go back and generate OTP again.')
      return
    }
    const otp = otpDigits.join('')
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }
    try {
      setLoading(true)
      const response = await verifyForgotPasswordOtp(identifier, otp)
      setSuccess(`${response.message}. Reset token: ${response.reset_token}`)
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="w-full bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center h-full px-8">
          <div className="text-2xl font-bold text-teal-600 tracking-tight">MedGenie</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-slate-600 hover:text-teal-600 transition-colors duration-200" href="#">
              Help
            </a>
            <a className="text-slate-600 hover:text-teal-600 transition-colors duration-200" href="#">
              Support
            </a>
            <Link className="text-teal-600 font-semibold border-b-2 border-teal-600 pb-1" to="/login">
              Back to Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-lg">
          <div className="bg-surface-container-lowest shadow-card rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-primary text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>
            <h1 className="text-4xl font-bold text-on-background mb-2">Verify Your Identity</h1>
            <p className="text-on-surface-variant max-w-sm mb-6">
              We&apos;ve sent a 6-digit code to your provided mobile number. Please enter it below.
            </p>
            {identifier && (
              <p className="text-sm text-on-surface-variant mb-3">OTP sent to mobile: {identifier}</p>
            )}

            <div className="grid grid-cols-6 gap-1 w-full mb-6">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  className="w-full h-14 text-center text-2xl rounded-lg bg-surface border border-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  maxLength={1}
                  placeholder="•"
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>

            <div className="flex flex-col w-full space-y-4">
              <div className="flex items-center justify-center space-x-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
                <span className="text-sm font-semibold">Resend in 0:45</span>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}
              <button
                className="w-full bg-primary-container text-on-primary-container text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all"
                onClick={handleVerify}
                type="button"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
              <Link className="text-primary text-sm font-semibold hover:underline" to="/forgot-password">
                Change mobile number
              </Link>
            </div>

            <div className="mt-6 w-full bg-surface-container-low p-4 rounded-lg border-l-4 border-primary text-left flex items-start space-x-2">
              <span className="material-symbols-outlined text-primary mt-1">info</span>
              <div>
                <p className="text-sm font-semibold text-on-surface">Secure Clinical Authentication</p>
                <p className="text-sm text-on-surface-variant">
                  This session is protected by MedGenie&apos;s encrypted infrastructure to ensure HIPAA compliance and patient data privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordOtpPage
