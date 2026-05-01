import { useNavigate } from 'react-router-dom'

function VisitDetailPage() {
  const navigate = useNavigate()

  return (
    <div className="font-inter bg-[#f4fcf0] text-[#171d16] antialiased min-h-screen">
      <aside className="w-[240px] h-full fixed left-0 top-0 bg-[#111827] border-r border-gray-800 flex flex-col py-6 z-50">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold text-white">MedGenie</h1>
          <p className="text-xs text-[#16a34a]">Provider</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/dashboard')} type="button">
            <span className="material-symbols-outlined mr-3">dashboard</span> Dashboard
          </button>
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/calendar')} type="button">
            <span className="material-symbols-outlined mr-3">calendar_today</span> Calendar
          </button>
          <button className="bg-[#2563eb] text-white mx-2 flex items-center px-4 py-2 rounded-lg border-l-4 border-white w-[calc(100%-1rem)]" onClick={() => navigate('/visits')} type="button">
            <span className="material-symbols-outlined mr-3">clinical_notes</span> Visits
          </button>
          <button className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full" onClick={() => navigate('/templates')} type="button">
            <span className="material-symbols-outlined mr-3">description</span> Templates
          </button>
          <button
            className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800 w-full"
            onClick={() => navigate('/settings')}
            type="button"
          >
            <span className="material-symbols-outlined mr-3">settings</span> Settings
          </button>
          <a className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800" href="#">
            <span className="material-symbols-outlined mr-3">credit_card</span> Subscription
          </a>
          <a className="text-gray-400 hover:text-white flex items-center px-4 py-2 hover:bg-gray-800" href="#">
            <span className="material-symbols-outlined mr-3">bar_chart</span> Analytics
          </a>
        </nav>
      </aside>

      <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 z-40">
        <div className="flex items-center space-x-6">
          <button className="text-gray-500 hover:opacity-80 transition-opacity" type="button">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button className="text-gray-500 hover:opacity-80 transition-opacity relative" type="button">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold">Dr. Rajesh Kumar</p>
              <p className="text-xs text-[#575e70]">Senior Pulmonologist</p>
            </div>
            <img
              alt="Dr. Profile"
              className="w-10 h-10 rounded-full border border-[#bdcaba] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuSkfvIW3phx7yHbt104mLhs656BoGQpYY09pPg3wUO_G9c3DWXj7ry68ypMznP1rTdyAPSXjX6Xk7cDbvJ1wgmWIlq_McPQW-9KpGS9qeEbJVVjt4YVfbIWGE8WyTOLE1nlg7wDw7fKdH7x-kMASiUT_StwHliRrFojXgKNfKBB79rNiWPg8DfC3FAxKDCDvu0pyNjmXjRMaDTqqlXXqHwQuQtOnhf_uKw2ti2h8FznKYlsSlVV4VYJ3tst3kLqJ3Qx1OO_BNWviI"
            />
          </div>
        </div>
      </header>

      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="p-8 pb-0">
          <nav className="flex items-center space-x-2 text-sm text-[#575e70] mb-4">
            <button className="hover:text-[#006b2c]" onClick={() => navigate('/dashboard')} type="button">Dashboard</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <button className="hover:text-[#006b2c]" onClick={() => navigate('/visits')} type="button">Visits</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-semibold text-[#171d16]">Asthma Consultation</span>
          </nav>

          <div className="bg-[#111827] rounded-xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  alt="Patient"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-[#006b2c]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5wjB4bCGivsoHc4557SxbmXVX7SnvEIxBtJj66qnr4iAipzt3Hqxo2G3iA5wYpVYzwDQCUdlmvtnwmc4NaB9IsBitNnupQWvB9gxZD4HCNWCbzA1xzu1vHEyy8CZiSq2nz8AqCYJMUB7huDMJlYW1Vpql888iiGsjatY5T2WHXF48hFcoFtjo_AB_MLqZOtz42QVgZwR97S8NTxyUJNMCcatjmxUyeMQSc0NlF4TXegfK0_JFFUOGO7hVgQ3be8oQWyNmXVG60ogG"
                />
                <span className="absolute -bottom-2 -right-2 bg-amber-500 text-[#171d16] font-bold px-2 py-1 rounded text-xs border-2 border-[#111827]">#007</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">Ananya Sharma</h2>
                  <span className="bg-white/10 px-3 py-0.5 rounded-full text-xs">🌐 Hindi</span>
                </div>
                <p className="text-gray-400">24 Years • Female • Asthma Follow-up</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center text-xs text-gray-400"><span className="material-symbols-outlined text-sm mr-1">bloodtype</span> B+</div>
                  <div className="flex items-center text-xs text-gray-400"><span className="material-symbols-outlined text-sm mr-1">height</span> 162 cm</div>
                  <div className="flex items-center text-xs text-gray-400"><span className="material-symbols-outlined text-sm mr-1">weight</span> 58 kg</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#a72d51] hover:bg-[#8a143c] text-white px-5 py-2.5 rounded-lg flex items-center font-semibold" type="button">
                <span className="material-symbols-outlined mr-2">description</span> Generate OPD Note
              </button>
              <button className="bg-[#16a34a] hover:bg-[#006b2c] text-white px-5 py-2.5 rounded-lg flex items-center font-semibold" type="button">
                <span className="material-symbols-outlined mr-2">send</span> Send WhatsApp
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg flex items-center font-semibold border border-white/20" type="button">
                <span className="material-symbols-outlined mr-2">add_circle</span> Add Lab Result
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 mt-8 border-b border-[#bdcaba]">
          <div className="flex space-x-12">
            <button className="pb-4 border-b-2 border-[#006b2c] text-[#006b2c] font-semibold flex items-center" type="button">
              <span className="material-symbols-outlined mr-2">fact_check</span> Intake
            </button>
            <button className="pb-4 border-b-2 border-transparent text-[#575e70] hover:text-[#171d16] flex items-center" type="button">
              <span className="material-symbols-outlined mr-2">assignment</span> OPD Note
            </button>
            <button className="pb-4 border-b-2 border-transparent text-[#575e70] hover:text-[#171d16] flex items-center" type="button">
              <span className="material-symbols-outlined mr-2">chat</span> WhatsApp
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-[#bdcaba] rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[18px] font-semibold">Initial Intake Progress</h3>
                  <span className="text-sm font-semibold text-[#006b2c]">85% Completed</span>
                </div>
                <div className="w-full bg-[#e9f0e5] rounded-full h-2.5 mb-8">
                  <div className="bg-[#006b2c] h-2.5 rounded-full w-[85%]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-[#ba1a1a]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                      <span className="font-semibold text-sm uppercase tracking-wider">Critical Allergies</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full mr-2" /> Penicillin</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full mr-2" /> Shellfish</li>
                    </ul>
                  </div>
                  <div className="bg-[#00873a]/10 border border-[#006b2c]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-[#006b2c]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                      <span className="font-semibold text-sm uppercase tracking-wider">Current Medications</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#006b2c] rounded-full mr-2" /> Salbutamol Inhaler (PRN)</li>
                      <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#006b2c] rounded-full mr-2" /> Cetirizine 10mg OD</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[18px] font-semibold">OPD Note Draft</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-[#bdcaba] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#575e70]">Section 01</span>
                      <span className="material-symbols-outlined text-[#6e7b6c]">edit</span>
                    </div>
                    <h4 className="font-semibold mb-2">Assessment</h4>
                    <p className="text-sm text-[#3e4a3d] leading-relaxed">
                      Patient presents with increased wheezing and nocturnal cough over the past 3 days. Peak flow meter
                      shows 15% reduction from baseline. Trigger identified as seasonal pollen increase.
                    </p>
                  </div>
                  <div className="bg-white border border-[#bdcaba] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#575e70]">Section 02</span>
                      <span className="material-symbols-outlined text-[#6e7b6c]">edit</span>
                    </div>
                    <h4 className="font-semibold mb-2">Plan</h4>
                    <p className="text-sm text-[#3e4a3d] leading-relaxed">
                      Escalate ICS dosage for 2 weeks. Maintain hydration. Review inhaler technique today. Follow up in 14
                      days or SOS.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#bdcaba] rounded-xl overflow-hidden">
                  <div className="bg-[#e9f0e5] px-6 py-3 border-b border-[#bdcaba] flex justify-between items-center">
                    <span className="font-semibold flex items-center">
                      <span className="material-symbols-outlined mr-2 text-[#006b2c]">prescriptions</span> Prescription (Rx)
                    </span>
                    <span className="text-xs text-[#575e70]">Last updated: Today, 10:45 AM</span>
                  </div>
                  <div className="p-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[#575e70] border-b border-[#bdcaba]">
                          <th className="pb-3 font-medium">Medicine</th>
                          <th className="pb-3 font-medium">Dosage</th>
                          <th className="pb-3 font-medium">Frequency</th>
                          <th className="pb-3 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#bdcaba]/50">
                        <tr>
                          <td className="py-4 font-semibold">Budecort 200 Inhaler</td>
                          <td className="py-4">2 Puffs</td>
                          <td className="py-4">BD (Morning/Night)</td>
                          <td className="py-4">15 Days</td>
                        </tr>
                        <tr>
                          <td className="py-4 font-semibold">Tab. Montair LC</td>
                          <td className="py-4">10 mg</td>
                          <td className="py-4">HS (At Night)</td>
                          <td className="py-4">10 Days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 rounded-xl p-6">
                  <h4 className="text-[#ba1a1a] font-semibold mb-3 flex items-center">
                    <span className="material-symbols-outlined mr-2">emergency</span> Patient Red Flags (Watch-list)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] px-3 py-1 rounded-full text-xs font-medium">Shortness of breath at rest</span>
                    <span className="bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] px-3 py-1 rounded-full text-xs font-medium">Difficulty speaking in full sentences</span>
                    <span className="bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] px-3 py-1 rounded-full text-xs font-medium">Bluish tint to lips</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-[#bdcaba] rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[18px] font-semibold">WhatsApp Update</h3>
                  <div className="flex items-center gap-1 text-[#16a34a]">
                    <span className="w-2 h-2 bg-[#16a34a] rounded-full" />
                    <span className="text-xs font-semibold">Active</span>
                  </div>
                </div>
                <div className="bg-[#e5ddd5] rounded-xl overflow-hidden border border-[#bdcaba] aspect-[9/16] relative flex flex-col">
                  <div className="bg-[#075e54] p-3 flex items-center text-white gap-3">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <img
                      alt="Patient Thumbnail"
                      className="w-8 h-8 rounded-full border border-white/20"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQnSPUVTyL-nhLjEbcbkrmF46xwC8vZWEv52r9qjkUJzEwqgo_rYYaOGpgczIaa7U0zelaLs6CRKgMShALJVdkwXqzIgQ4YlWLp6XVe2phA0JGpVZoImQ-XI1DG3ozERRh36YlZpA-VBq_0xR7A1NnRS7lsmLNDf7VR-DD_P6KQpkwRx0gWiiW3vDOIWEIiURMZZFitEhs8P-VihYzAKk0X7RDGVaJesB5d6X25cxAij-piSMdaKfFM-tzU7rwxZX1II_IOMyGgCpz"
                    />
                    <div>
                      <p className="text-sm font-bold leading-tight">Ananya Sharma</p>
                      <p className="text-[10px] opacity-80">Online</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs relative">
                      नमस्ते अनन्या, आपकी आज की जांच रिपोर्ट तैयार है। कृपया नीचे दिए गए निर्देशों का पालन करें।
                      <span className="text-[8px] text-[#575e70] absolute bottom-1 right-2">10:52 AM</span>
                    </div>
                    <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto text-xs relative">
                      <p className="font-bold mb-1">Prescription Summary:</p>
                      - Budecort Inhaler (2 puffs BD)
                      <br />- Tab. Montair LC (1 HS)
                      <br />अगले 15 दिनों तक जारी रखें।
                      <span className="text-[8px] text-[#575e70] absolute bottom-1 right-2">
                        10:55 AM <span className="text-[#34b7f1] ml-0.5">✓✓</span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex items-center gap-2">
                    <div className="flex-1 bg-[#e9f0e5] rounded-full px-4 py-2 text-xs text-[#575e70]">Type message...</div>
                    <div className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">mic</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-[#16a34a] hover:bg-[#006b2c] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98]" type="button">
                  <span className="material-symbols-outlined">send</span> Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#006b2c] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50" type="button">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  )
}

export default VisitDetailPage
