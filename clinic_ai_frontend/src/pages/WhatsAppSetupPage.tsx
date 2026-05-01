function WhatsAppSetupPage() {
  return (
    <div className="bg-background font-manrope text-on-background min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-teal-600">MedGenie</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-all active:scale-95" type="button">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-all active:scale-95" type="button">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-16 px-6">
        <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12 mb-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-primary bg-primary-fixed/30 px-3 py-1 rounded-full">Step 5 of 5</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-8 h-2 rounded-full bg-primary"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-on-surface mb-2">Automate Patient Care</h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Enhance your practice with WhatsApp Business. Send automated appointment reminders, follow-up messages, and AI-driven health tips directly to your patients.
            </p>
          </div>

          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-card p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-teal-600 !text-5xl">chat</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">WhatsApp Business API</h2>
              <p className="text-base text-secondary mb-8">
                Connecting your official WhatsApp Business number allows MedGenie to represent your practice professionally on the world&apos;s most popular messaging app.
              </p>
              <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary hover:bg-primary-container text-on-primary font-semibold py-4 px-8 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2" type="button">
                  <span className="material-symbols-outlined">link</span>
                  Connect WhatsApp Business
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-on-surface font-semibold py-4 px-8 rounded-xl transition-all active:scale-95" type="button">
                  Skip for now (Use default)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#F0FDFA] p-6 rounded-xl border-l-4 border-teal-600">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-teal-600">notifications_active</span>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface mb-1">Auto-Reminders</h3>
                    <p className="text-sm text-secondary">Reduce no-shows by 40% with automated appointment confirmations and 24h reminders.</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F0FDFA] p-6 rounded-xl border-l-4 border-teal-600">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-teal-600">volunteer_activism</span>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface mb-1">Care Follow-ups</h3>
                    <p className="text-sm text-secondary">Automatically check in on patients post-procedure to ensure recovery is on track.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-card overflow-hidden h-full flex flex-col">
              <div className="bg-teal-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">person</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-none">MedGenie Care</span>
                  <span className="text-[10px] text-teal-100 uppercase tracking-widest">Official Business Account</span>
                </div>
              </div>
              <div className="flex-grow p-4 bg-[#E5DDD5]">
                <div className="bg-white rounded-lg p-3 mb-4 shadow-sm max-w-[85%] relative">
                  <p className="text-[13px] leading-relaxed">Hello Rohan, this is a reminder for your appointment with Dr. Mehta tomorrow at 10:30 AM. Reply 1 to Confirm or 2 to Reschedule.</p>
                </div>
                <div className="bg-[#DCF8C6] rounded-lg p-3 mb-4 shadow-sm max-w-[85%] ml-auto">
                  <p className="text-[13px] leading-relaxed">1</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                  <p className="text-[13px] leading-relaxed">Great! Your appointment is confirmed. See you soon!</p>
                </div>
              </div>
              <div className="p-3 bg-white text-center border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400">Live Preview of Auto-Response</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 flex justify-end items-center gap-6 mt-2">
            <button className="text-secondary font-semibold hover:text-primary transition-colors" type="button">
              Go Back to Step 4
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="bg-primary hover:bg-primary-container text-on-primary font-semibold py-4 px-12 rounded-xl shadow-md transition-all active:scale-95" type="button">
              Finish Onboarding
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default WhatsAppSetupPage
