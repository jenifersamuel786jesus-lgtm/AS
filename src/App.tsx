import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { PreSowingAdvisory } from './components/farmer/PreSowingAdvisory';
import { MandiExplorer } from './components/farmer/MandiExplorer';
import { ProfitCalculator } from './components/farmer/ProfitCalculator';
import { PostHarvestPlanner } from './components/farmer/PostHarvestPlanner';
import { PriceForecastModule } from './components/farmer/PriceForecastModule';
import { CrashRiskAdvisory } from './components/farmer/CrashRiskAdvisory';
import { AdminPortal } from './components/admin/AdminPortal';
import { LoginModal } from './components/auth/LoginModal';
import { Language, UserRole, UserProfile } from './types';
import { DEFAULT_FARMER_USER } from './data/authUsers';
import {
  Sprout,
  PhoneCall,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('agrishield_lang') as Language) || 'en';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agrishield_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_FARMER_USER;
      }
    }
    return DEFAULT_FARMER_USER;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return currentUser?.role || 'farmer';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('oddanchatram');

  // Auth Modal State
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loginModalRole, setLoginModalRole] = useState<'farmer' | 'admin'>('farmer');
  const [unauthorizedMsg, setUnauthorizedMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('agrishield_lang', language);
  }, [language]);

  const handleOpenLogin = (role: 'farmer' | 'admin' = 'farmer', message?: string) => {
    setLoginModalRole(role);
    setUnauthorizedMsg(message || null);
    setLoginModalOpen(true);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem('agrishield_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }
    setUnauthorizedMsg(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agrishield_user');
    setUserRole('farmer');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfb] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        userRole={userRole}
        setUserRole={setUserRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userRole === 'admin' ? (
          currentUser?.role === 'admin' ? (
            <AdminPortal language={language} />
          ) : (
            /* Restricted Admin Gate Card */
            <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl p-8 border border-stone-200 shadow-xl text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-stone-900 text-emerald-400 font-bold">
                  Restricted MLOps Console
                </span>
                <h2 className="text-2xl font-bold font-['Outfit'] text-stone-900">
                  {language === 'ta'
                    ? 'அதிகாரப்பூர்வ உள்நுழைவு தேவை'
                    : 'Agricultural Officer Clearance Required'}
                </h2>
                <p className="text-sm text-stone-600 max-w-lg mx-auto">
                  {language === 'ta'
                    ? 'அக்ரிஷீல்ட் அட்மின் போர்ட்டலில் இயந்திர கற்றல் மாதிரி அளவீடுகள் (MAE ₹116.21), மாதிரி எடைகள் வரைபடம் மற்றும் அக்மார்க்நெட் சிஎஸ்வி பதிவேற்றங்கள் உள்ளன. இதனை அணுக அங்கீகரிக்கப்பட்ட அதிகாரி சான்றுகளுடன் உள்நுழையவும்.'
                    : 'The AgriShield Admin Portal contains sensitive Agmarknet telemetry, out-of-time model validation diagnostics (MAE ₹116.21), and APMC data ingestion. You must sign in with an Agricultural Marketing Officer credential.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenLogin(
                      'admin',
                      language === 'ta'
                        ? 'அட்மின் போர்ட்டலை அணுக அதிகாரி கணக்கைத் தேர்ந்தெடுக்கவும்.'
                        : 'Select or authenticate as an Agricultural Officer to proceed.'
                    )
                  }
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'ta'
                      ? 'அதிகாரியாய் உள்நுழைக (Admin Login)'
                      : 'Log In as Officer / Admin'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserRole('farmer');
                    setActiveTab('home');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition"
                >
                  {language === 'ta'
                    ? 'விவசாயி தளத்திற்குத் திரும்பு'
                    : 'Return to Farmer Advisory'}
                </button>
              </div>
            </div>
          )
        ) : (
          <>
            {activeTab === 'home' && (
              <FarmerDashboard
                language={language}
                onNavigate={(tab) => setActiveTab(tab)}
                selectedMandiId={selectedMandiId}
                setSelectedMandiId={setSelectedMandiId}
              />
            )}

            {activeTab === 'advisory' && (
              <PreSowingAdvisory language={language} />
            )}

            {activeTab === 'mandi' && (
              <MandiExplorer
                language={language}
                selectedMandiId={selectedMandiId}
                setSelectedMandiId={setSelectedMandiId}
              />
            )}

            {activeTab === 'profit' && (
              <ProfitCalculator language={language} />
            )}

            {activeTab === 'rescue' && (
              <PostHarvestPlanner
                language={language}
                selectedMandiId={selectedMandiId}
              />
            )}

            {activeTab === 'forecast' && (
              <PriceForecastModule
                language={language}
                selectedMandiId={selectedMandiId}
              />
            )}

            {activeTab === 'risk' && (
              <CrashRiskAdvisory
                language={language}
                selectedMandiId={selectedMandiId}
              />
            )}
          </>
        )}
      </main>

      {/* Dual Role Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        language={language}
        onLogin={handleLogin}
        initialRole={loginModalRole}
        unauthorizedMessage={unauthorizedMsg}
      />

      {/* Trust & Transparency Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white font-['Outfit']">AgriShield</span>
                <span className="text-[11px] text-stone-400 block">
                  AI-Powered Crop Market Intelligence, Pre-Sowing Advisory & Post-Harvest Rescue System
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <span className="inline-flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified APMC Datasets</span>
              </span>
              <a
                href="tel:1551"
                className="inline-flex items-center space-x-1 text-stone-300 hover:text-white transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kisan Helpline: 1551</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-400 text-[11px] leading-relaxed">
            <div>
              <p className="font-semibold text-stone-200 mb-1">
                {language === 'ta' ? 'அறிவியல் மற்றும் வெளிப்படைத்தன்மை உறுதிமொழி:' : 'Agronomic & Modeling Methodology:'}
              </p>
              <p>
                {language === 'ta'
                  ? 'அக்ரிஷீல்ட் அரசு அக்மார்க்நெட் சந்தை தொடர்கள் மற்றும் மாநில வேளாண் பல்கலைக் கழக உற்பத்தி செலவு அளவுகோல்களை அடிப்படையாகக் கொண்டு செயல்படுகிறது. இயந்திர கற்றல் மாதிரிகள் கடுமையான காலவரிசை (Out-of-Time) முறையில் மதிப்பீடு செய்யப்பட்டு சோதனை செய்யப்பட்டுள்ளது.'
                  : 'AgriShield utilizes verified Agmarknet APMC time-series data and State Agricultural University production budgets. Predictive algorithms undergo strict out-of-time chronological testing (Training: 2024-2026, Testing: 2026) to prevent lookahead data leakage.'}
              </p>
            </div>

            <div>
              <p className="font-semibold text-stone-200 mb-1">
                {language === 'ta' ? 'சட்டப்பூர்வ அறிவிப்பு:' : 'Statutory Advisory Disclaimer:'}
              </p>
              <p>
                {language === 'ta'
                  ? 'இந்த தளம் விவசாயிகளுக்கான முடிவெடுக்கும் துணை வழிகாட்டி மட்டுமே. சந்தை விலை ஏற்றத்தாழ்வுகள், போக்குவரத்து கட்டணங்கள் மற்றும் வானிலை மாற்றங்களை விற்பனைக்கு முன் உள்ளூரில் நேரடியாக உறுதிசெய்து கொள்ளவும்.'
                  : 'AgriShield is a decision-support platform designed to assist small and marginal farmers. Predictions and scenario recommendations do not constitute guaranteed commercial returns or replace on-ground inspection by agricultural officers.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
            <div>
              © 2026 AgriShield Platform. Built for Indian Agriculture & Farmer Welfare.
            </div>
            <div>
              Version 1.2.0 • Role-Protected Authentication
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
