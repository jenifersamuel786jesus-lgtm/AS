import React, { useState } from 'react';
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
  LogIn,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import { Language, UserRole, UserProfile } from '../types';
import { t } from '../utils/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenLogin: (role?: 'farmer' | 'admin', message?: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  userRole,
  setUserRole,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleRoleClick = (role: UserRole) => {
    if (role === 'admin') {
      if (currentUser?.role === 'admin') {
        setUserRole('admin');
      } else {
        onOpenLogin(
          'admin',
          language === 'ta'
            ? 'அதிகாரி மற்றும் MLOps போர்ட்டலை அணுக வேளாண் வணிக அலுவலர் சான்றுகளுடன் உள்நுழையவும்.'
            : 'Access to Admin Portal & MLOps Telemetry requires Agricultural Officer authorization.'
        );
      }
    } else {
      setUserRole(role);
    }
  };

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
          onClick={() => {
            if (userRole === 'admin' && currentUser?.role !== 'admin') {
              setUserRole('farmer');
            }
            setActiveTab('home');
          }}
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

        {/* Center / Role Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => handleRoleClick('farmer')}
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
            onClick={() => handleRoleClick('fpo')}
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
            onClick={() => handleRoleClick('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              userRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t(language, 'adminPortal')}</span>
            {currentUser?.role !== 'admin' && (
              <span className="text-[9px] bg-stone-700 text-amber-300 px-1 py-0.2 rounded font-mono">
                🔒
              </span>
            )}
          </button>
        </div>

        {/* Right Section: User Profile & Language Controls */}
        <div className="flex items-center space-x-2.5">
          {/* User Account Capsule */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 bg-stone-800 hover:bg-stone-700/90 text-stone-200 border border-stone-700 px-2.5 py-1.5 rounded-xl transition text-xs font-medium"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-600'
                      : currentUser.role === 'fpo'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight text-white flex items-center space-x-1">
                    <span>
                      {language === 'ta' ? currentUser.nameTa : currentUser.name}
                    </span>
                    <span
                      className={`text-[9px] font-semibold uppercase px-1 py-0.1 rounded ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {language === 'ta' ? currentUser.districtTa : currentUser.district}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 p-3 z-50 text-xs animate-fadeIn">
                    <div className="pb-2.5 border-b border-stone-100">
                      <p className="font-bold text-stone-900 text-sm">
                        {language === 'ta' ? currentUser.nameTa : currentUser.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {currentUser.identifier}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        {currentUser.role === 'admin'
                          ? (language === 'ta' ? currentUser.designationTa : currentUser.designation)
                          : `${language === 'ta' ? currentUser.districtTa : currentUser.district} • ${currentUser.landArea} ${language === 'ta' ? 'ஏக்கர்' : 'Acres'} (${language === 'ta' ? currentUser.primaryCropTa : currentUser.primaryCrop})`}
                      </p>
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenLogin(currentUser.role === 'admin' ? 'farmer' : 'admin');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 flex items-center justify-between text-stone-700 font-medium transition"
                      >
                        <span className="flex items-center space-x-2">
                          <Layers className="w-3.5 h-3.5 text-stone-500" />
                          <span>
                            {currentUser.role === 'admin'
                              ? (language === 'ta' ? 'விவசாயி கணக்கிற்கு மாற்றுக' : 'Switch to Farmer Login')
                              : (language === 'ta' ? 'அதிகாரி கணக்கிற்கு மாற்றுக' : 'Switch to Admin Login')}
                          </span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenLogin('farmer');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 flex items-center space-x-2 text-stone-700 font-medium transition"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {language === 'ta' ? 'சுயவிவரங்களை மாற்று' : 'Switch User / Demo Profiles'}
                        </span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold flex items-center space-x-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'வெளியேறு (Logout)' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenLogin('farmer')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 transition"
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
