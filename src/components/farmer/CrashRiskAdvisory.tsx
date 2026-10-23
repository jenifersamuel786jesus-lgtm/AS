import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Send,
  Info,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';
import { CROPS, MANDIS, MODEL_METRICS } from '../../data/agriData';
import { evaluateCrashRisk } from '../../utils/calculations';
import { t } from '../../utils/translations';

interface CrashRiskAdvisoryProps {
  language: Language;
  selectedMandiId: string;
}

export const CrashRiskAdvisory: React.FC<CrashRiskAdvisoryProps> = ({
  language,
  selectedMandiId,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [arrivalSurgeMultiplier, setArrivalSurgeMultiplier] = useState<number>(1.35);
  const [smsPhone, setSmsPhone] = useState<string>('9842109876');
  const [smsSent, setSmsSent] = useState<boolean>(false);

  const currentCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const currentMandi = MANDIS.find((m) => m.id === selectedMandiId) || MANDIS[0];

  const riskResult = evaluateCrashRisk(selectedCropId, arrivalSurgeMultiplier);

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Feature 4 • Price Crash Risk Advisory (Model B Telemetry)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'riskHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'riskSub')}
        </p>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்:' : 'Select Crop for Crash Advisory:'}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.nameTa : c.name} ({c.perishability} Perishability)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'மண்டி வரத்து பெருக்கம் (Simulated Surge):' : 'Observed Mandi Inflow Surge:'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={arrivalSurgeMultiplier}
                onChange={(e) => setArrivalSurgeMultiplier(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-xs font-bold text-stone-800 whitespace-nowrap">
                {(arrivalSurgeMultiplier * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-[10px] text-stone-400">
              Ratio to 30-day baseline moving average
            </span>
          </div>

          <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <div className="font-bold text-stone-800">Operational Target Mandi:</div>
            <div>{currentMandi.name} ({currentMandi.state})</div>
          </div>
        </div>
      </div>

      {/* Main Risk Status Hero Card */}
      <div
        className={`rounded-2xl p-6 border-2 shadow-sm transition ${
          riskResult.riskLevel === 'HIGH'
            ? 'bg-rose-50/80 border-rose-400'
            : riskResult.riskLevel === 'MODERATE'
            ? 'bg-amber-50/80 border-amber-400'
            : 'bg-emerald-50/80 border-emerald-400'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  riskResult.riskLevel === 'HIGH'
                    ? 'bg-rose-600 animate-ping'
                    : riskResult.riskLevel === 'MODERATE'
                    ? 'bg-amber-600'
                    : 'bg-emerald-600'
                }`}
              ></span>
              <span
                className={`font-extrabold ${
                  riskResult.riskLevel === 'HIGH'
                    ? 'text-rose-800'
                    : riskResult.riskLevel === 'MODERATE'
                    ? 'text-amber-800'
                    : 'text-emerald-800'
                }`}
              >
                {riskResult.riskLevel === 'HIGH'
                  ? t(language, 'riskLevelHigh')
                  : riskResult.riskLevel === 'MODERATE'
                  ? t(language, 'riskLevelModerate')
                  : t(language, 'riskLevelLow')}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
              {currentCrop.name} ({language === 'ta' ? currentCrop.nameTa : ''}) @ {currentMandi.name}
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 max-w-xl leading-relaxed">
              {riskResult.riskLevel === 'HIGH'
                ? language === 'ta'
                  ? 'மண்டி வரத்து சராசரியை விட கணிசமாக அதிகரித்துள்ளது. அடுத்த 7 நாட்களில் 20% க்கும் மேல் விலை சரிவு ஏற்படும் வாய்ப்பு அதிகம் உள்ளது.'
                  : 'Daily mandi inflow has breached critical thresholds. Production classifier flags high probability of ≥20% price collapse within 7 days.'
                : riskResult.riskLevel === 'MODERATE'
                ? language === 'ta'
                  ? 'சந்தை வரத்து மிதமாக உயர்ந்துள்ளது. விலை ஏற்ற இறக்கங்களை தொடர்ந்து கண்காணிக்கவும்.'
                  : 'Market arrival is moderately elevated. Exercise caution before unbagging large perishable batches.'
                : language === 'ta'
                ? 'சந்தை வரத்து மற்றும் விலை நிலை சீராக உள்ளது. வழக்கமான விற்பனையை தொடரலாம்.'
                : 'Market supply and price trends are stable within historical bounds.'}
            </p>
          </div>

          {/* Probability & Drop Gauge */}
          <div className="flex items-center space-x-6 flex-shrink-0 bg-white/90 backdrop-blur p-4 rounded-2xl border border-stone-200">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-['Outfit']">
                {riskResult.crashProbability}%
              </div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                {t(language, 'riskProbability')}
              </div>
            </div>

            <div className="w-px h-12 bg-stone-200"></div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-['Outfit']">
                -{riskResult.expectedPriceDropPct}%
              </div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                Expected Spread Risk
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Supporting Factors & Recommended Tactical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supporting Factors */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-stone-100">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-800">
              {t(language, 'riskTriggers')}
            </h3>
          </div>

          <div className="space-y-3">
            {riskResult.mainDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start space-x-3"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    driver.impact === 'negative'
                      ? 'bg-rose-500'
                      : driver.impact === 'positive'
                      ? 'bg-emerald-500'
                      : 'bg-stone-400'
                  }`}
                ></div>
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {language === 'ta' ? driver.factorTa : driver.factor}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {language === 'ta' ? driver.detailTa : driver.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-800">
              {t(language, 'riskMitigations')}
            </h3>
          </div>

          <div className="space-y-3">
            {riskResult.recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-900">
                    {language === 'ta' ? action.titleTa : action.title}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      action.urgency === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {action.urgency} Urgency
                  </span>
                </div>
                <div className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {language === 'ta' ? action.descriptionTa : action.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMS Alert Simulation Dispatch Card */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-5 shadow-md border border-stone-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Twilio SMS Gateway Simulation</span>
            </div>
            <h4 className="text-base font-bold text-white">
              {language === 'ta'
                ? 'விலை எச்சரிக்கையை உங்கள் மொபைல் எண்ணுக்கு SMS-ஆகப் பெறலாம்'
                : 'Dispatch Instant SMS Market Alert to Farmer Mobile'}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              {language === 'ta'
                ? 'அவசர சந்தை எச்சரிக்கைகள் தமிழ் மற்றும் ஆங்கிலத்தில் அனுப்பப்படும்.'
                : 'Delivers transparent early warning and mitigation advice in local language.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <input
              type="text"
              value={smsPhone}
              onChange={(e) => setSmsPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="w-36 text-xs bg-stone-800 border border-stone-600 rounded-lg p-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              onClick={handleSendSms}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t(language, 'btnSendSms')}</span>
            </button>
          </div>
        </div>

        {/* SMS Dispatch Simulation Notification */}
        {smsSent && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-200 flex items-start space-x-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-100">
                {t(language, 'smsSuccess')}
              </div>
              <div className="text-[11px] text-emerald-300 mt-1 font-mono bg-stone-900/60 p-2 rounded border border-emerald-800">
                {language === 'ta'
                  ? `[அக்ரிஷீல்ட் எச்சரிக்கை] ${currentCrop.nameTa} (${currentMandi.nameTa}): சந்தை வரத்து 35% அதிகரித்துள்ளது. அடுத்த 7 நாட்களில் 24% விலை வீழ்ச்சி ஏற்பட வாய்ப்பு உள்ளது. அறுவடையை பிரித்து மேற்கொண்டு அருகில் உள்ள பிற மண்டிகளை பரிசீலிக்கவும். உதவி: 1551.`
                  : `[AgriShield Alert] ${currentCrop.name} @ ${currentMandi.name}: Inflow surged +35%. 7-day crash probability is ${riskResult.crashProbability}%. Stagger harvest and evaluate metro mandi transport. Helpline: 1551.`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
