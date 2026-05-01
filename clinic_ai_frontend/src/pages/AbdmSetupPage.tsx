import { useNavigate } from 'react-router-dom'

function AbdmSetupPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background font-manrope text-on-background min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tight text-teal-600">MedGenie</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            <a className="text-teal-600 font-semibold border-b-2 border-teal-600 py-1" href="#">Setup</a>
            <a className="text-slate-500 hover:text-teal-500 py-1 transition-colors" href="#">Resources</a>
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 transition-colors rounded-full" type="button">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 transition-colors rounded-full" type="button">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1280px] mx-auto px-6 py-12 w-full">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-3 items-center text-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary bg-primary-container/10 px-3 py-1 rounded-full">Step 4 of 5</span>
              <span className="text-sm font-semibold text-slate-400">ABDM Integration</span>
            </div>
            <div className="flex gap-2 mt-1">
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
              <div className="h-1.5 w-12 rounded-full bg-slate-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-xl shadow-card flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-bold text-on-surface">Ayushman Bharat Digital Mission (ABDM) Linkage</h1>
                  <p className="text-lg text-secondary">
                    Enhance your clinic&apos;s credibility and reach by integrating with India&apos;s unified healthcare ecosystem.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div className="flex flex-col gap-2 p-6 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary mb-1">verified</span>
                    <h3 className="text-xl font-semibold">Trust &amp; Compliance</h3>
                    <p className="text-sm text-on-surface-variant">Get recognized as a verified healthcare provider on the National Health Portal.</p>
                  </div>
                  <div className="flex flex-col gap-2 p-6 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary mb-1">sync</span>
                    <h3 className="text-xl font-semibold">Seamless Transfers</h3>
                    <p className="text-sm text-on-surface-variant">Securely share and receive patient records digitally with other ABDM clinics.</p>
                  </div>
                  <div className="flex flex-col gap-2 p-6 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary mb-1">health_and_safety</span>
                    <h3 className="text-xl font-semibold">Insurance Ready</h3>
                    <p className="text-sm text-on-surface-variant">Simplify cashless claim processing with integrated digital health records.</p>
                  </div>
                  <div className="flex flex-col gap-2 p-6 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary mb-1">visibility</span>
                    <h3 className="text-xl font-semibold">Global Visibility</h3>
                    <p className="text-sm text-on-surface-variant">Allow patients to find your clinic easily through the ABDM provider search.</p>
                  </div>
                </div>
              </div>
              <div className="bg-primary-container/10 p-6 rounded-xl border-l-4 border-primary flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <p className="text-sm font-semibold text-on-primary-fixed-variant mb-1">Important Note</p>
                  <p className="text-sm text-on-surface-variant">Health Facility Registry (HFR) registration requires your clinic&apos;s business registration documents and the head doctor&apos;s professional IDs.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-xl shadow-card border border-slate-100">
                <img className="w-full h-48 object-cover rounded-lg mb-8" alt="Professional medical environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs6gGkRFAxYhP7Eo4Gm24AMAbAq_PMQwR_tNHCcIRhVHV4G5SdLqKkabKl785HsqJ4gxxGMflv9W5AazuDcQRgTU14tS0KPUWt8zDzc0Wxe9lfT5T_SBMbup6qkw0745UgPZs3WFNZuWuyeoTZ9afVbZbaLOZQPov8Y7upO6RbCfYXOJB9-gWi_sY4GP8EYQ6mFZK5g-BCoYpUYtlQxmJRB8pONTcBSC7WNPVfEYU7xwhu3_-1__4NbaD8cx3kqWFciZKK-MHMC8Y" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold text-on-surface">Registration Selection</h3>
                  <p className="text-base text-on-surface-variant">Would you like to initiate the HFR registration process now? You can also complete this later from your dashboard settings.</p>
                  <div className="flex flex-col gap-3 mt-3">
                    <button
                      className="w-full bg-primary text-white text-sm font-semibold py-4 px-6 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                      type="button"
                      onClick={() => navigate('/whatsapp-setup')}
                    >
                      Link clinic to ABDM (HFR registration)
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      className="w-full bg-slate-100 text-slate-900 text-sm font-semibold py-4 px-6 rounded-lg hover:bg-slate-200 transition-all"
                      type="button"
                      onClick={() => navigate('/whatsapp-setup')}
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">support_agent</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Need help with HFR?</p>
                      <p className="text-sm text-secondary">Our specialists can guide you through the process.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#F0FDFA] p-4 rounded-lg border-l-2 border-primary flex gap-2">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">auto_awesome</span>
                <p className="text-sm text-on-surface-variant">
                  Clinics linked with ABDM see a <strong>24% higher patient retention rate</strong> due to digital ease and trust factors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-6">
          <span className="font-bold text-teal-600">MedGenie</span>
          <span className="text-sm text-slate-600">© 2024 MedGenie. Empathetic Precision in Healthcare.</span>
        </div>
        <div className="flex items-center gap-8">
          <a className="text-sm text-slate-600 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Privacy Policy</a>
          <a className="text-sm text-slate-600 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Terms of Service</a>
          <a className="text-sm text-slate-600 hover:text-teal-500 underline-offset-4 hover:underline" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  )
}

export default AbdmSetupPage
