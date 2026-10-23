import React from 'react';
import {
  Sprout,
  ShieldAlert,
  BarChart3,
  Globe2,
  PhoneCall,
  UserCheck,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { t } from '../utils/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  userRole,
  setUserRole,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-900 text-white shadow-md border-b border-stone-800">
      {/* Top Utility Ticker */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap justify-between items-center border-b border-emerald-900/60">
        <div className="flex items-center space-x-2 font-medium">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-700 text-white font-bold tracking-wide uppercase">
            Govt APMC Data
          </span>
          <span className="hidden sm:inline">
            {language === 'ta'
              ? 'சரிபார்க்கப்பட்ட அக்மார்க்நெட் நேரலைத் தரவு • 10 மண்டிகள் & 10 பயிர்கள்'
              : 'Verified Agmarknet APMC Benchmarks • 10 Mandis & 10 Commodities'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold">{t(language, 'dataFreshness')}</span>
          </div>
          <a
            href="tel:1551"
            className="hidden md:flex items-center space-x-1 text-emerald-300 hover:text-white transition font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t(language, 'helpline')}</span>
          </a>
        </div>
      </div>

      {/* Main Brand & Actions Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white group-hover:scale-105 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                AgriShield
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v1.2
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              {language === 'ta'
                ? 'விவசாயிகளுக்கான விலை பாதுகாப்பு & மீட்பு தளம்'
                : 'AI Crop Intelligence & Market Rescue System'}
            </p>
          </div>
        </button>

        {/* Center / Role Navigation */}
        <div className="flex items-center space-x-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => setUserRole('farmer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              userRole === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t(language, 'farmerPortal')}</span>
          </button>
          <button
            onClick={() => setUserRole('fpo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              userRole === 'fpo'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t(language, 'fpoPortal')}</span>
          </button>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              userRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t(language, 'adminPortal')}</span>
          </button>
        </div>

        {/* Right Utility: Language Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 transition"
            title="Toggle Tamil / English"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Navigation for Farmer Portal */}
      {userRole !== 'admin' && (
        <nav className="bg-stone-950 border-t border-stone-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 py-2">
            {[
              { id: 'home', label: t(language, 'navHome'), icon: Sprout },
              { id: 'advisory', label: t(language, 'navAdvisory'), icon: CheckCircle2 },
              { id: 'mandi', label: t(language, 'navMandi'), icon: BarChart3 },
              { id: 'profit', label: t(language, 'navProfit'), icon: Building2 },
              { id: 'rescue', label: t(language, 'navRescue'), icon: ShieldAlert },
              { id: 'forecast', label: t(language, 'navForecast'), icon: BarChart3 },
              { id: 'risk', label: t(language, 'navRisk'), icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
