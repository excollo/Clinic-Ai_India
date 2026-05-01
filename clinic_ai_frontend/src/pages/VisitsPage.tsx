import { useNavigate } from 'react-router-dom'

const visitRows = [
  {
    name: 'Jonathan Miller - Follow-up Cardiology',
    meta: 'ID: #MG-8812 • Patient since 2021',
    status: 'In Progress',
    stage: 'Assessment Stage',
    date: 'Today, 10:30 AM',
    duration: 'Scheduled: 45 min',
    tone: 'blue',
  },
  {
    name: 'Sarah Jenkins - Routine Wellness Exam',
    meta: 'ID: #MG-9024 • New Patient',
    status: 'Scheduled',
    stage: 'Check-in Pending',
    date: 'Today, 2:15 PM',
    duration: 'Scheduled: 30 min',
    tone: 'amber',
  },
  {
    name: 'Michael Ross - Orthopedic Consultation',
    meta: 'ID: #MG-7731 • Post-Op Recovery',
    status: 'Completed',
    stage: 'Billing Finalized',
    date: 'Yesterday, 4:00 PM',
    duration: 'Duration: 55 min',
    tone: 'green',
  },
  {
    name: 'Elena Rodriguez - Diabetes Management',
    meta: 'ID: #MG-8142 • Chronic Care',
    status: 'In Progress',
    stage: 'Vitals Recorded',
    date: 'Today, 11:45 AM',
    duration: 'Scheduled: 20 min',
    tone: 'blue',
  },
] as const

function statusClasses(tone: string) {
  if (tone === 'amber') return 'bg-amber-100 text-[#f59e0b] border-amber-200'
  if (tone === 'green') return 'bg-green-100 text-[#22c55e] border-green-200'
  return 'bg-blue-100 text-[#3b82f6] border-blue-200'
}

function iconClasses(tone: string) {
  if (tone === 'amber') return 'bg-amber-50 text-amber-600'
  if (tone === 'green') return 'bg-green-50 text-green-600'
  return 'bg-blue-50 text-blue-600'
}

function VisitsPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f4fcf0] text-[#171d16] min-h-screen">
      <aside className="w-[240px] fixed left-0 top-0 bg-[#111827] border-r border-gray-800 flex flex-col h-full py-6 text-sm">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold text-white">MedGenie</h1>
          <p className="text-gray-400 text-xs">Provider</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/dashboard')} type="button">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </button>
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/calendar')} type="button">
            <span className="material-symbols-outlined mr-3">calendar_today</span>
            Calendar
          </button>
          <button className="bg-[#2563eb] text-white rounded-lg mx-2 flex items-center px-4 py-2 border-l-4 border-white w-[calc(100%-1rem)]" type="button">
            <span className="material-symbols-outlined mr-3">clinical_notes</span>
            Visits
          </button>
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/templates')} type="button">
            <span className="material-symbols-outlined mr-3">description</span>
            Templates
          </button>
          <button
            className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full"
            onClick={() => navigate('/settings')}
            type="button"
          >
            <span className="material-symbols-outlined mr-3">settings</span>
            Settings
          </button>
          <a className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800" href="#">
            <span className="material-symbols-outlined mr-3">credit_card</span>
            Subscription
          </a>
          <a className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800" href="#">
            <span className="material-symbols-outlined mr-3">bar_chart</span>
            Analytics
          </a>
        </nav>
      </aside>

      <main className="ml-[240px] min-h-screen">
        <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <button className="flex items-center gap-2 text-gray-500 hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard')} type="button">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-gray-500 cursor-pointer">language</span>
              <span className="material-symbols-outlined text-gray-500 cursor-pointer">notifications</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Dr. Profile</p>
                <p className="text-[10px] text-gray-500">Chief Surgeon</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e9f0e5] border border-[#bdcaba]">
                <img
                  alt="Dr. Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbp_oWoE3bnBWCkxmGVQ6riaAyjs30B1Lo4Yhu5A5siihngE_nkAwxix-gGJYVdzU4cQw_1IauziH6vjCZxnBvpbUStMTrJMrXVoRW824lR8gZXHpXH9NuXgGmlvJsypd8lBwB6F__9FwTsvsiOXcWv9zKXjR19PCkpmgUymUSSC8YnRLjQDZAudIip-mTk3zjw6nyQRhuMUQJ2PNfv001VyWkBwe_k2WUxeTtt-2IPbA-mra85Nie88vfkwye-IGtIoKlqYm8HsEM"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="pt-24 px-8 pb-12">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold">Visit Management</h2>
            <p className="text-[#3e4a3d] mt-1">Manage patient visits and documentation</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex bg-[#eff6ea] p-1 rounded-xl w-fit border border-[#bdcaba]">
              <button className="px-6 py-2 rounded-lg text-sm font-medium bg-[#2563eb] text-white" type="button">All Visits</button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#171d16]" type="button">Scheduled</button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#171d16]" type="button">In Progress</button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#171d16]" type="button">Completed</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Visits</p>
              <h3 className="text-2xl font-bold">1,284</h3>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="ml-1">12% from last month</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Now</p>
              <h3 className="text-2xl font-bold text-[#3b82f6]">18</h3>
              <div className="mt-2 text-xs text-gray-500">Currently in rooms</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Scheduled Today</p>
              <h3 className="text-2xl font-bold text-[#f59e0b]">42</h3>
              <div className="mt-2 text-xs text-gray-500">8 upcoming slots</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Completion Rate</p>
              <h3 className="text-2xl font-bold text-[#16a34a]">96.4%</h3>
              <div className="mt-2 text-xs text-gray-500">Above average</div>
            </div>
          </div>

          <div className="space-y-4">
            {visitRows.map((row) => (
              <div
                key={row.name}
                className="group bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-[#2563eb] transition-all cursor-pointer"
                onClick={() => navigate('/visits/detail')}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconClasses(row.tone)}`}>
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{row.name}</h4>
                    <p className="text-sm text-gray-500">{row.meta}</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses(row.tone)}`}>{row.status}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{row.stage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-medium">{row.date}</p>
                    <p className="text-xs text-gray-400">{row.duration}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-[#2563eb] transition-colors">chevron_right</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1-4 of 1,284 visits</p>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400" type="button">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-[#2563eb] bg-[#2563eb] text-white rounded-lg" type="button">1</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600" type="button">2</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600" type="button">3</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400" type="button">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VisitsPage
