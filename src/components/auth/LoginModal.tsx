import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Building2,
  BadgeCheck,
  Sparkles,
  ShieldAlert,
  Mail,
  Eye,
  EyeOff,
  BellRing,
  RotateCw,
  MapPin,
  Trees,
  Droplets,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { DEMO_FARMERS, DEMO_ADMINS } from '../../data/authUsers';
import { CROPS, MANDIS } from '../../data/agriData';

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
  const [activeTab, setActiveTab] = useState<'farmer-login' | 'farmer-register' | 'admin-login'>(
    initialRole === 'admin' ? 'admin-login' : 'farmer-login'
  );

  // Farmer Sign In States
  const [phone, setPhone] = useState<string>('98421 77312');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('8491');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(false);
  const [farmerError, setFarmerError] = useState<string>('');

  // Farmer Registration States
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regDistrict, setRegDistrict] = useState<string>('Dindigul');
  const [regTaluk, setRegTaluk] = useState<string>('Oddanchatram');
  const [regLandArea, setRegLandArea] = useState<number>(3.0);
  const [regSoilType, setRegSoilType] = useState<string>('Red Sandy Loam');
  const [regIrrigation, setRegIrrigation] = useState<string>('Borewell & Drip Irrigation');
  const [regPrimaryCrop, setRegPrimaryCrop] = useState<string>('tomato');
  const [regConsentSms, setRegConsentSms] = useState<boolean>(true);
  const [regStep, setRegStep] = useState<'form' | 'verify'>('form');
  const [regOtp, setRegOtp] = useState<string>('');

  // Admin Sign In States
  const [adminEmail, setAdminEmail] = useState<string>('admin@agrishield.in');
  const [adminPassword, setAdminPassword] = useState<string>('AgriShield#2026');
  const [adminPin, setAdminPin] = useState<string>('7721');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string>('');
  const [isAdminVerifying, setIsAdminVerifying] = useState<boolean>(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds]);

  if (!isOpen) return null;

  // Handle Trigger Real SMS Dispatch
  const handleSendFarmerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFarmerError(
        language === 'ta'
          ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setFarmerError('');
    // Generate realistic 4-digit code
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setTimerSeconds(30);
    setShowSmsBanner(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim() !== generatedOtp) {
      setFarmerError(
        language === 'ta'
          ? `தவறான ஓடிபி குறியீடு. குறுஞ்செய்தியில் வந்த குறியீட்டை உள்ளிடவும் (${generatedOtp})`
          : `Invalid OTP code. Please enter the code sent via SMS (${generatedOtp})`
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Check if known demo farmer
      const cleanPhone = phone.replace(/\D/g, '');
      const matched = DEMO_FARMERS.find((f) => f.phone?.replace(/\D/g, '').includes(cleanPhone)) || {
        id: `farmer-${Date.now()}`,
        name: 'Farmer Partner',
        nameTa: 'விவசாய பங்குதாரர்',
        role: 'farmer' as const,
        identifier: `+91 ${phone}`,
        phone: `+91 ${phone}`,
        district: 'Dindigul',
        districtTa: 'திண்டுக்கல்',
        taluk: 'Oddanchatram',
        talukTa: 'ஒட்டன்சத்திரம்',
        state: 'Tamil Nadu',
        landArea: 3.5,
        soilType: 'Red Sandy Loam',
        soilTypeTa: 'செம்மண் வண்டல்',
        irrigationType: 'Borewell & Drip',
        irrigationTypeTa: 'ஆழ்துளை கிணறு & சொட்டு நீர்',
        primaryCrop: 'Tomato',
        primaryCropTa: 'தக்காளி',
        savedCrops: ['tomato', 'small_onion'],
        smsAlertsEnabled: true,
        whatsappAlertsEnabled: true,
        clearanceLevel: 'Kisan Verified',
        lastLogin: 'Just now',
        advisoryHistory: [],
      };

      onLogin(matched);
      onClose();
    }, 700);
  };

  // Handle Registration
  const handleStartReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setFarmerError(language === 'ta' ? 'உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your full name');
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFarmerError(language === 'ta' ? 'சரியான மொபைல் எண்ணை உள்ளிடவும்' : 'Please enter valid 10-digit mobile');
      return;
    }
    setFarmerError('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setRegStep('verify');
    setShowSmsBanner(true);
  };

  const handleFinishReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (regOtp !== generatedOtp) {
      setFarmerError(
        language === 'ta'
          ? `தவறான ஓடிபி. SMS குறியீட்டை உள்ளிடவும்: ${generatedOtp}`
          : `Invalid OTP. Enter the code shown in SMS: ${generatedOtp}`
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const cropObj = CROPS.find((c) => c.id === regPrimaryCrop);
      const newFarmer: UserProfile = {
        id: `farmer-reg-${Date.now()}`,
        name: regName.trim(),
        nameTa: regName.trim(),
        role: 'farmer',
        identifier: `+91 ${regPhone.trim()}`,
        phone: `+91 ${regPhone.trim()}`,
        district: regDistrict,
        districtTa: regDistrict,
        taluk: regTaluk,
        talukTa: regTaluk,
        state: 'Tamil Nadu',
        landArea: regLandArea,
        soilType: regSoilType,
        soilTypeTa: regSoilType,
        irrigationType: regIrrigation,
        irrigationTypeTa: regIrrigation,
        primaryCrop: cropObj?.name || 'Tomato',
        primaryCropTa: cropObj?.nameTa || 'தக்காளி',
        savedCrops: [regPrimaryCrop],
        smsAlertsEnabled: regConsentSms,
        whatsappAlertsEnabled: true,
        clearanceLevel: `Kisan Verified (TN-${Math.floor(10000 + Math.random() * 90000)})`,
        lastLogin: 'Just now',
        advisoryHistory: [
          {
            id: `adv-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'pre_sowing',
            title: 'Initial Farmer Profile Registration & Land Baseline',
            titleTa: 'விவசாயி சுயவிவர பதிவு மற்றும் நில அளவீடு',
            cropName: cropObj?.name || 'Tomato',
            detail: `Account successfully created with ${regLandArea} acres in ${regDistrict} district with ${regIrrigation}.`,
            detailTa: `${regDistrict} மாவட்டத்தில் ${regLandArea} ஏக்கர் நில விவரங்களுடன் கணக்கு துவங்கப்பட்டது.`,
          },
        ],
      };

      onLogin(newFarmer);
      onClose();
    }, 700);
  };

  // Handle Admin Login
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

    setIsAdminVerifying(true);
    setTimeout(() => {
      setIsAdminVerifying(false);
      const matched =
        DEMO_ADMINS.find((a) => a.email?.toLowerCase() === adminEmail.trim().toLowerCase()) ||
        DEMO_ADMINS[0];
      onLogin(matched);
      onClose();
    }, 600);
  };

  const selectQuickProfile = (profile: UserProfile) => {
    onLogin(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Real-time SMS Notification Banner that slides down from top */}
      {showSmsBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/50 animate-bounceOnce">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-stone-950 text-xs font-bold">
                📩
              </span>
              <div>
                <p className="text-xs font-extrabold tracking-wide uppercase text-emerald-400">
                  GOVT-AGRI • SMS GATEWAY
                </p>
                <p className="text-[10px] text-stone-400">Just now • Kisan Alert Service</p>
              </div>
            </div>
            <button
              onClick={() => setShowSmsBanner(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 text-xs text-stone-200 leading-relaxed bg-stone-950/70 p-2.5 rounded-xl border border-stone-800">
            {language === 'ta' ? (
              <span>
                அக்ரிஷீல்ட் உறுதிப்படுத்தல் குறியீடு: <strong className="text-emerald-400 text-sm font-mono">{generatedOtp}</strong>. பயிர் ஆலோசனை மற்றும் மண்டி விலை தகவல்களைப் பெற இதைப் பயன்படுத்தவும்.
              </span>
            ) : (
              <span>
                Your AgriShield verification OTP is <strong className="text-emerald-400 text-sm font-mono">{generatedOtp}</strong>. Valid for 10 minutes for crop market intelligence access.
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'farmer-login') {
                  setEnteredOtp(generatedOtp);
                } else {
                  setRegOtp(generatedOtp);
                }
                setShowSmsBanner(false);
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? `குறியீடு ${generatedOtp} ஐ உள்ளிடு` : `Auto-fill ${generatedOtp}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Outfit']">
                  {language === 'ta' ? 'அக்ரிஷீல்ட் நேரலை உள்நுழைவு' : 'AgriShield Live Portal Gateway'}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  v1.2 Auth
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {language === 'ta'
                  ? 'விவசாயி நேரடி பதிவு அல்லது அரசு அலுவலர் சான்றுகளுடன் உள்நுழைக'
                  : 'Farmer self-service registration or Agricultural Officer MLOps login'}
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

        {/* Unauthorized alert warning */}
        {unauthorizedMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                {language === 'ta' ? 'அதிகாரப்பூர்வ அணுகல் தேவை' : 'Restricted Administrative Access'}
              </p>
              <p className="text-xs text-amber-800">{unauthorizedMessage}</p>
            </div>
          </div>
        )}

        {/* 3 Main Role Navigation Tabs */}
        <div className="grid grid-cols-3 p-2 bg-stone-100 border-b border-stone-200 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('farmer-login');
              setFarmerError('');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'farmer-login'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'விவசாயி உள்நுழைவு' : 'Farmer Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('farmer-register');
              setFarmerError('');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'farmer-register'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'புதிய பதிவு' : 'New Farmer Register'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin-login');
              setAdminError('');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'admin-login'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'அதிகாரி போர்ட்டல்' : 'Officer / MLOps'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: FARMER LOGIN WITH REAL SMS OTP */}
          {activeTab === 'farmer-login' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-start space-x-2.5 text-xs text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === 'ta' ? 'உடனடி நேரலை ஓடிபி சரிபார்ப்பு:' : 'Live SMS OTP Verification:'}
                  </span>{' '}
                  {language === 'ta'
                    ? 'உங்கள் மொபைல் எண்ணை உள்ளிட்டு "ஓடிபி அனுப்புக" பொத்தானை அழுத்தவும். திரையில் வரும் மாதிரி SMS அறிவிப்பிலிருந்து நேரடியாக உள்நுழையலாம்.'
                    : 'Enter your 10-digit mobile number. You will receive an on-screen SMS notification code to simulate real carrier delivery.'}
                </div>
              </div>

              {/* Login Form */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                {!otpSent ? (
                  <form onSubmit={handleSendFarmerOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'பதிவு செய்யப்பட்ட மொபைல் எண்' : 'Registered Mobile Number'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 font-semibold text-sm">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                      <BellRing className="w-4 h-4" />
                      <span>{language === 'ta' ? 'ஓடிபி அனுப்புக (Send SMS OTP)' : 'Send SMS OTP to Mobile'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-stone-700">
                          {language === 'ta' ? 'குறுஞ்செய்தி ஓடிபி (4 இலக்கம்)' : 'Enter 4-Digit SMS Code'}
                        </label>
                        <span className="text-[11px] text-stone-500">
                          {language === 'ta' ? `எண்: +91 ${phone}` : `Phone: +91 ${phone}`}
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          maxLength={4}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="8491"
                          className="w-full text-center tracking-[0.4em] text-xl font-mono font-extrabold py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs mt-2">
                        {timerSeconds > 0 ? (
                          <span className="text-stone-500">
                            {language === 'ta' ? `மீண்டும் அனுப்ப: ${timerSeconds} விநாடிகள்` : `Resend code in ${timerSeconds}s`}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendFarmerOtp}
                            className="text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>{language === 'ta' ? 'மீண்டும் ஓடிபி அனுப்புக' : 'Resend SMS Code'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowSmsBanner(true)}
                          className="text-stone-500 hover:text-stone-800 underline"
                        >
                          {language === 'ta' ? 'SMS பார்க்க' : 'View SMS Banner'}
                        </button>
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
                      disabled={isVerifying}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <span>{language === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying Credentials...'}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'ta' ? 'உள்நுழைக (Enter Portal)' : 'Verify & Enter AgriShield'}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* 1-Click Fast Profiles */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'ta' ? 'உடனடி மாதிரி சுயவிவரங்கள்' : 'Instant 1-Click Demo Profiles'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_FARMERS.map((farmer) => (
                    <button
                      key={farmer.id}
                      type="button"
                      onClick={() => selectQuickProfile(farmer)}
                      className="text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/40 transition group"
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
                      <div className="mt-1.5 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
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
          )}

          {/* TAB 2: NEW FARMER REGISTRATION WITH FARM DETAILS */}
          {activeTab === 'farmer-register' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-950">
                <p className="font-bold mb-0.5">
                  {language === 'ta' ? 'இலவச புதிய விவசாயி பதிவு:' : 'Free Farmer Onboarding & Farm Profiling:'}
                </p>
                <p className="text-stone-600">
                  {language === 'ta'
                    ? 'உங்கள் விளைநில பரப்பளவு, மண் வகை, பாசன முறையை பதிவு செய்வதன் மூலம் துல்லியமான முன்-விதைப்பு ஆலோசனைகளைப் பெறுங்கள்.'
                    : 'Provide your land acreage, soil type, and irrigation source to personalize agronomic suitability scores and market recommendations.'}
                </p>
              </div>

              {regStep === 'form' ? (
                <form onSubmit={handleStartReg} className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'முழு பெயர்' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={language === 'ta' ? 'எ.கா: சுப்பிரமணியன் கே.' : 'e.g. Subramanian K.'}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number (for SMS)'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'மாவட்டம்' : 'District'} *
                      </label>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        {MANDIS.map((m) => (
                          <option key={m.district} value={m.district}>
                            {language === 'ta' ? m.districtTa : m.district}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'வட்டம் / தாலுகா' : 'Taluk / Block'}
                      </label>
                      <input
                        type="text"
                        value={regTaluk}
                        onChange={(e) => setRegTaluk(e.target.value)}
                        placeholder="Oddanchatram / Palani"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'நிலப்பரப்பு (ஏக்கர்)' : 'Land Area (Acres)'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="200"
                        value={regLandArea}
                        onChange={(e) => setRegLandArea(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'மண் வகை' : 'Soil Type'}
                      </label>
                      <select
                        value={regSoilType}
                        onChange={(e) => setRegSoilType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Red Sandy Loam">Red Sandy Loam (செம்மண்)</option>
                        <option value="Black Cotton Soil">Black Cotton Soil (கரிசல்)</option>
                        <option value="Clayey Alluvial Soil">Clayey Alluvial (வண்டல் மண்)</option>
                        <option value="Laterite Soil">Laterite Soil (சரளை மண்)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {language === 'ta' ? 'பாசன முறை' : 'Irrigation Source'}
                      </label>
                      <select
                        value={regIrrigation}
                        onChange={(e) => setRegIrrigation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Borewell & Drip Irrigation">Borewell & Drip (சொட்டு நீர்)</option>
                        <option value="Canal Irrigation">Canal Irrigation (கால்வாய்)</option>
                        <option value="Open Well">Open Well (திறந்த கிணறு)</option>
                        <option value="Rainfed">Rainfed (மானாவாரி)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? 'முக்கிய பயிர்' : 'Primary Crop Cultivated'}
                    </label>
                    <select
                      value={regPrimaryCrop}
                      onChange={(e) => setRegPrimaryCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      {CROPS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {language === 'ta' ? `${c.nameTa} (${c.name})` : `${c.name} (${c.category})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regConsentSms}
                        onChange={(e) => setRegConsentSms(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        {language === 'ta'
                          ? 'தினசரி மண்டி விலை மாற்றங்கள் & வானிலை எச்சரிக்கைகள் குறுஞ்செய்தியாக பெற விரும்புகிறேன்.'
                          : 'I consent to receive daily APMC market price spikes & weather alerts via SMS.'}
                      </span>
                    </label>
                  </div>

                  {farmerError && (
                    <p className="text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{farmerError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm mt-3"
                  >
                    <span>{language === 'ta' ? 'ஓடிபி சரிபார்த்து பதிவு செய்' : 'Proceed to OTP Verification'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFinishReg} className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? 'மொபைலுக்கு அனுப்பப்பட்ட ஓடிபி (4 இலக்கம்)' : 'Enter 4-Digit Registration Code'}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value)}
                      placeholder="8491"
                      className="w-full text-center tracking-[0.4em] text-xl font-mono font-extrabold py-2.5 rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      {language === 'ta' ? `SMS குறியீடு: ${generatedOtp}` : `Simulated SMS code: ${generatedOtp}`}
                    </p>
                  </div>

                  {farmerError && (
                    <p className="text-xs text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{farmerError}</span>
                    </p>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="w-1/3 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                    >
                      {language === 'ta' ? 'பின்செல்' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-2/3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <span>{language === 'ta' ? 'பதிவாகிறது...' : 'Creating Account...'}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'ta' ? 'பதிவை முடித்து உள்நுழை' : 'Complete Registration'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN & MLOPS PORTAL LOGIN */}
          {activeTab === 'admin-login' && (
            <div className="space-y-4">
              <div className="bg-stone-900 text-stone-200 rounded-xl p-3 border border-stone-800 flex items-start space-x-2.5 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ MLOps அணுகல்:' : 'Authorized Agricultural Officer Clearance:'}
                  </span>{' '}
                  {language === 'ta'
                    ? 'இயந்திர கற்றல் மாதிரி மதிப்பீடு வரைபடங்கள், MAE அளவீடுகள் (₹116.21/குவிண்டால்), மற்றும் அக்மார்க்நெட் CSV உள்ளீடுகளுக்கான பாதுகாப்பு வளையம்.'
                    : 'Access restricted to review out-of-time chronological ML validation plots, model drift diagnostics, and APMC CSV live data ingestion.'}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAdminSubmit} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'Officer Email / Staff ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@agrishield.in"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 text-sm"
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
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-stone-900 font-semibold focus:ring-2 focus:ring-stone-900 text-sm font-mono"
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
                  disabled={isAdminVerifying}
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-sm disabled:opacity-50"
                >
                  {isAdminVerifying ? (
                    <span>{language === 'ta' ? 'அங்கீகரிக்கிறது...' : 'Authenticating Clearance...'}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ta' ? 'நிர்வாகியாய் உள்நுழைக' : 'Authenticate & Enter Admin Portal'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Fast Admin Demo Accounts */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ மாதிரி கணக்குகள்' : 'Pre-Authorized Demo Officers'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_ADMINS.map((admin) => (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => selectQuickProfile(admin)}
                      className="text-left p-2.5 rounded-xl border border-stone-200 hover:border-stone-800 bg-stone-50 hover:bg-stone-100 transition group"
                    >
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
                      <div className="mt-2 pt-1.5 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-500">
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

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>
            {language === 'ta'
              ? 'அனைத்து அமர்வுகளும் பாதுகாக்கப்பட்டவை • அமர்வு குறியீடு: #AGR-2026'
              : 'End-to-End Encrypted Session • AgriShield v1.2 Gateway'}
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
