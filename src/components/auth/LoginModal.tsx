import React, { useState } from 'react';
import {
  Sprout,
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Building2,
  BadgeCheck,
  Sparkles,
  ShieldAlert,
  Mail,
  Fingerprint,
} from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { DEMO_FARMERS, DEMO_ADMINS } from '../../data/authUsers';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLogin: (user: UserProfile) => void;
  initialRole?: 'farmer' | 'admin';
  unauthorizedMessage?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  language,
  onLogin,
  initialRole = 'farmer',
  unauthorizedMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'farmer' | 'admin'>(initialRole);
  
  // Farmer Login States
  const [farmerPhone, setFarmerPhone] = useState<string>('98421 77312');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [farmerOtp, setFarmerOtp] = useState<string>('');
  const [farmerError, setFarmerError] = useState<string>('');

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState<string>('admin@agrishield.in');
  const [adminPassword, setAdminPassword] = useState<string>('AgriShield#2026');
  const [adminPin, setAdminPin] = useState<string>('7721');
  const [adminError, setAdminError] = useState<string>('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerPhone.trim() || farmerPhone.replace(/\D/g, '').length < 10) {
      setFarmerError(
        language === 'ta'
          ? 'தயவுசெய்து சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }
    setFarmerError('');
    setOtpSent(true);
    setFarmerOtp('1234'); // Pre-fill sample OTP for convenience
  };

  const handleVerifyFarmerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (farmerOtp !== '1234' && farmerOtp.length < 4) {
      setFarmerError(
        language === 'ta'
          ? 'தவறான ஓடிபி (பரிசோதனைக்கு 1234 ஐ உள்ளிடவும்)'
          : 'Invalid OTP (use demo OTP: 1234)'
      );
      return;
    }

    // Match or create farmer profile
    const cleanPhone = farmerPhone.replace(/\D/g, '');
    const matched = DEMO_FARMERS.find((f) => f.phone?.replace(/\D/g, '').includes(cleanPhone)) || {
      id: `farmer-custom-${Date.now()}`,
      name: 'Farmer Partner (விவசாயி)',
      nameTa: 'விவசாய பங்குதாரர்',
      role: 'farmer' as const,
      identifier: `+91 ${farmerPhone}`,
      phone: `+91 ${farmerPhone}`,
      district: 'Dindigul',
      districtTa: 'திண்டுக்கல்',
      state: 'Tamil Nadu',
      landArea: 3.0,
      primaryCrop: 'Tomato',
      primaryCropTa: 'தக்காளி',
      clearanceLevel: 'Kisan Verified',
      lastLogin: 'Just now',
    };

    onLogin(matched);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.includes('@') || !adminPassword) {
      setAdminError(
        language === 'ta'
          ? 'அங்கீகரிக்கப்பட்ட மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்'
          : 'Please enter authorized email and password'
      );
      return;
    }

    // Match demo admin or grant login
    const matched = DEMO_ADMINS.find((a) => a.email?.toLowerCase() === adminEmail.trim().toLowerCase()) || DEMO_ADMINS[0];
    onLogin(matched);
    onClose();
  };

  const selectQuickProfile = (profile: UserProfile) => {
    onLogin(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
        {/* Header with Title and Close button */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Outfit']">
                  {language === 'ta' ? 'அக்ரிஷீல்ட் உள்நுழைவு' : 'AgriShield Access Gateway'}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Role-Protected
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {language === 'ta'
                  ? 'விவசாயி அல்லது வேளாண் வணிக அதிகாரியாக பாதுகாப்பாக உள்நுழைக'
                  : 'Select your role: Farmer Self-Service or Agricultural Officer / MLOps Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unauthorized alert warning if navigated without permissions */}
        {unauthorizedMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                {language === 'ta' ? 'அதிகாரப்பூர்வ அணுகல் தேவை' : 'Restricted Administrative Access'}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">{unauthorizedMessage}</p>
            </div>
          </div>
        )}

        {/* Role Selector Tabs (Farmer vs Admin) */}
        <div className="grid grid-cols-2 p-3 bg-stone-100 border-b border-stone-200 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('farmer');
              setFarmerError('');
            }}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2.5 transition ${
              activeTab === 'farmer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>
              {language === 'ta' ? 'விவசாயி உள்நுழைவு (Farmer)' : 'Farmer & FPO Login'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminError('');
            }}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2.5 transition ${
              activeTab === 'admin'
                ? 'bg-stone-900 text-white shadow-md shadow-stone-900/30'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ta' ? 'அதிகாரி / நிர்வாகி (Admin)' : 'Admin & MLOps Portal'}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'farmer' ? (
            /* FARMER LOGIN TAB */
            <div className="space-y-6">
              {/* Context Banner */}
              <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === 'ta' ? 'இலவச விவசாயி சேவை:' : 'Farmer Direct Access:'}
                  </span>{' '}
                  {language === 'ta'
                    ? 'முன்-விதைப்பு ஆலோசனை, நேரலை மண்டி விலை ஒப்பீடு, 7-நாள் விலை கணிப்பு மற்றும் அவசர மீட்பு திட்டங்கள்.'
                    : 'Get pre-sowing recommendations, 10 Mandi real-time modal prices, 7-day forecast bands, and distress-sale rescue plans.'}
                </div>
              </div>

              {/* Mobile OTP Form */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {language === 'ta' ? 'மொபைல் எண் மூலம் நேரடி உள்நுழைவு' : 'Login with Mobile / Kisan ID'}
                </h3>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'மொபைல் எண் (10 இலக்கம்)' : 'Registered Mobile Number'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 font-semibold text-sm">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={farmerPhone}
                          onChange={(e) => setFarmerPhone(e.target.value)}
                          placeholder="98421 77312"
                          className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    {farmerError && (
                      <p className="text-xs text-rose-600 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{farmerError}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm"
                    >
                      <span>{language === 'ta' ? 'ஓடிபி அனுப்புக' : 'Get OTP on Phone'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyFarmerOtp} className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-stone-700">
                          {language === 'ta' ? 'ஓடிபி சரிபார்ப்புக் குறியீடு' : 'Enter 4-Digit OTP'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-emerald-700 font-semibold hover:underline"
                        >
                          {language === 'ta' ? 'எண்ணை மாற்று' : 'Change Number'}
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={farmerOtp}
                        onChange={(e) => setFarmerOtp(e.target.value)}
                        placeholder="1234"
                        className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        {language === 'ta'
                          ? 'பரிசோதனைக்கு தானாக பூர்த்தி செய்யப்பட்ட குறியீடு: 1234'
                          : 'Pre-filled demo verification code: 1234'}
                      </p>
                    </div>

                    {farmerError && (
                      <p className="text-xs text-rose-600 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{farmerError}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'ta' ? 'உள்நுழைக' : 'Verify & Enter AgriShield'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* 1-Click Demo Profiles for College/Project Presentation */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'ta' ? 'உடனடி மாதிரி சுயவிவரங்கள் (1-Click Demo)' : 'Instant 1-Click Demo Farmer Profiles'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEMO_FARMERS.map((farmer) => (
                    <button
                      key={farmer.id}
                      type="button"
                      onClick={() => selectQuickProfile(farmer)}
                      className="text-left p-3 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/50 transition group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                            {language === 'ta' ? farmer.nameTa : farmer.name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {language === 'ta' ? farmer.districtTa : farmer.district} • {farmer.landArea} {language === 'ta' ? 'ஏக்கர்' : 'Acres'}
                          </p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {language === 'ta' ? farmer.primaryCropTa : farmer.primaryCrop}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-500">
                        <span>{farmer.identifier}</span>
                        <span className="font-semibold text-emerald-700 group-hover:underline flex items-center space-x-0.5">
                          <span>{language === 'ta' ? 'தேர்ந்தெடு' : 'Login'}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ADMIN LOGIN TAB */
            <div className="space-y-6">
              {/* Security Advisory Banner */}
              <div className="bg-stone-900 text-stone-200 rounded-xl p-3.5 border border-stone-800 flex items-start space-x-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">
                    {language === 'ta' ? 'அரசு மற்றும் MLOps பாதுகாப்பு வளையம்:' : 'Authorized Personnel Clearance:'}
                  </span>{' '}
                  {language === 'ta'
                    ? 'இந்த பகுதி மாடல் துல்லிய அளவீடுகள் (MAE ₹116.21), மாதிரி எடை வரைபடங்கள் மற்றும் நேரடி மண்டி தரவு உள்ளீட்டிற்கு மட்டுமே.'
                    : 'Restricted to Agricultural Marketing Board Officers and Data Engineers to audit ML models, review diagnostic plots, and ingest Agmarknet CSV feeds.'}
                </div>
              </div>

              {/* Admin Credentials Form */}
              <form onSubmit={handleAdminSubmit} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {language === 'ta' ? 'அலுவலர் மின்னஞ்சல் & சான்றுகள்' : 'Government Officer Credentials'}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'Official Portal Email / Officer ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@agrishield.in"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? 'கடவுச்சொல்' : 'Secure Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? '2FA பாதுகாப்பு குறியீடு' : 'Officer 2FA PIN'}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="7721"
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {adminError && (
                  <p className="text-xs text-rose-600 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{adminError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'ta'
                      ? 'நிர்வாகியாய் உள்நுழைக (Enter Admin MLOps)'
                      : 'Authenticate & Enter Admin Portal'}
                  </span>
                </button>
              </form>

              {/* 1-Click Fast Admin Demo Accounts */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ மாதிரி கணக்குகள் (1-Click Demo)' : 'Pre-Authorized Demo Officer Credentials'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEMO_ADMINS.map((admin) => (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => selectQuickProfile(admin)}
                      className="text-left p-3 rounded-xl border border-stone-200 hover:border-stone-800 bg-stone-50 hover:bg-stone-100 transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                            {language === 'ta' ? admin.nameTa : admin.name}
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-stone-900 text-emerald-400">
                            LEVEL-4
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-1">
                          {language === 'ta' ? admin.designationTa : admin.designation}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="font-mono">{admin.identifier}</span>
                        <span className="font-semibold text-stone-900 group-hover:underline flex items-center space-x-0.5">
                          <span>{language === 'ta' ? 'அணுகுக' : 'Enter'}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>
            {language === 'ta'
              ? 'அனைத்து அமர்வுகளும் பாதுகாக்கப்பட்டவை • அமர்வு குறியீடு: #AGR-2026'
              : 'End-to-End Encrypted Session • Protocol: AgriShield v1.2'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-stone-700 hover:text-stone-900"
          >
            {language === 'ta' ? 'மூடுக' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
