import { useNavigate } from 'react-router-dom'

function ClinicSetupPage() {
  const navigate = useNavigate()
  return (
    <div className="font-manrope text-on-background bg-background min-h-screen pb-28">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-teal-600">MedGenie</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            <a className="text-teal-600 font-semibold border-b-2 border-teal-600 py-1" href="#">
              Setup
            </a>
            <a className="text-slate-500 hover:text-teal-500 py-1 transition-colors" href="#">
              Resources
            </a>
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all" type="button">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all" type="button">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 mb-20">
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-primary">Clinic Configuration</span>
            <span className="text-xs font-semibold text-outline">Step 3 of 5</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[60%]"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 md:p-8 border-b border-surface-container">
            <h1 className="text-4xl font-bold text-on-surface mb-2">Clinic Setup</h1>
            <p className="text-on-surface-variant">
              Provide the operational details of your medical practice to personalize your digital workspace.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface">Clinic name</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 outline-none" placeholder="e.g. Apollo Medical Centre" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">City</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant focus:border-primary rounded-lg p-3 outline-none" placeholder="Bangalore" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">State</label>
                    <select className="w-full bg-surface-container-low border border-outline-variant focus:border-primary rounded-lg p-3 outline-none">
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Pincode</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant focus:border-primary rounded-lg p-3 outline-none" placeholder="560001" type="text" />
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary mb-2">add_a_photo</span>
                <p className="text-sm font-semibold text-on-surface-variant text-center">Upload Clinic Logo (Optional)</p>
                <p className="text-[10px] text-outline mt-1 uppercase tracking-widest font-bold">PNG or SVG - 500kb max</p>
              </div>
            </div>

            <div className="h-px bg-surface-container"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <h3 className="text-xl font-semibold text-on-surface">OPD hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg">
                    <span>Morning Session</span>
                    <div className="flex items-center gap-2">
                      <input className="border-none bg-transparent p-0 w-20 focus:ring-0" type="time" defaultValue="09:00" />
                      <span className="text-outline">to</span>
                      <input className="border-none bg-transparent p-0 w-20 focus:ring-0" type="time" defaultValue="13:00" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg">
                    <span>Evening Session</span>
                    <div className="flex items-center gap-2">
                      <input className="border-none bg-transparent p-0 w-20 focus:ring-0" type="time" defaultValue="17:00" />
                      <span className="text-outline">to</span>
                      <input className="border-none bg-transparent p-0 w-20 focus:ring-0" type="time" defaultValue="21:00" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">translate</span>
                  <h3 className="text-xl font-semibold text-on-surface">Default consultation language(s)</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary-container/10 border border-primary/20 rounded-full cursor-pointer">
                    <input className="rounded-sm text-primary focus:ring-primary w-4 h-4" defaultChecked type="checkbox" />
                    <span className="text-sm font-semibold text-primary">English</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full cursor-pointer">
                    <input className="rounded-sm text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                    <span className="text-sm font-semibold text-on-surface-variant">Hindi</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full cursor-pointer">
                    <input className="rounded-sm text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                    <span className="text-sm font-semibold text-on-surface-variant">Marathi</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-surface-container-low flex justify-between items-center">
            <button className="px-6 py-3 text-on-surface-variant font-semibold hover:text-on-surface transition-colors flex items-center gap-2" type="button">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Step 2
            </button>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg hover:opacity-90 transition-all" type="button">
                Save Draft
              </button>
              <button
                className="px-10 py-3 bg-primary text-on-primary font-semibold rounded-lg shadow-md hover:opacity-95 transition-all"
                type="button"
                onClick={() => navigate('/abdm-setup')}
              >
                Continue to Step 4
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClinicSetupPage
