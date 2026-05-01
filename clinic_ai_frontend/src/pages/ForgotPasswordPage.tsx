import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestForgotPasswordOtp } from '../services/authService'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerateOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!identifier.trim()) {
      setError('Please enter your email or phone number.')
      return
    }

    try {
      setLoading(true)
      const response = await requestForgotPasswordOtp(identifier.trim())
      setMessage(response.message)
      navigate('/forgot-password-otp', {
        state: { identifier: identifier.trim() },
      })
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to generate OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center">
      <header className="w-full bg-white shadow-sm border-b border-slate-200 h-16 px-8 flex justify-between items-center max-w-[1280px]">
        <div className="text-2xl font-bold text-primary tracking-tight">MedGenie</div>
        <nav className="flex gap-6 items-center">
          <a className="text-sm text-slate-600 hover:text-primary transition-colors" href="#">
            Help
          </a>
          <a className="text-sm text-slate-600 hover:text-primary transition-colors" href="#">
            Support
          </a>
          <Link
            className="px-4 py-1 bg-slate-100 rounded-lg text-sm text-on-surface hover:bg-slate-200 transition-all"
            to="/login"
          >
            Back to Login
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-14 w-full">
        <div className="max-w-[480px] w-full bg-white rounded-xl shadow-card p-8 border border-slate-100">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-4xl">
                lock_reset
              </span>
            </div>
            <h1 className="text-4xl font-bold text-on-surface mb-2">Reset Your Password</h1>
            <p className="text-on-surface-variant max-w-[340px]">
              Enter your registered email address or phone number to receive a verification code.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleGenerateOtp}>
            <div>
              <label
                className="block text-sm font-semibold text-on-surface-variant mb-1"
                htmlFor="identifier"
              >
                Email or Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  id="identifier"
                  placeholder="name@example.com or +91..."
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}
            <button
              className="w-full bg-primary text-on-primary py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate OTP'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              to="/login"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
