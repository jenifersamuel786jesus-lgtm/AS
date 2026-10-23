import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sprout,
  Bug,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';
import {
  WEATHER_FORECAST_DATA,
  CROP_STAGE_GUIDELINES,
  PEST_DIAGNOSTICS_DATA,
  KVK_CENTERS_DATA,
} from '../../data/duringCropData';
import { CROPS } from '../../data/agriData';

interface DuringCropSupportProps {
  language: Language;
}

export const DuringCropSupport: React.FC<DuringCropSupportProps> = ({ language }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [subTab, setSubTab] = useState<'weather' | 'stages' | 'pests' | 'experts'>('weather');
  const [selectedPestId, setSelectedPestId] = useState<string>('pest-tomato-blight');

  const stages = CROP_STAGE_GUIDELINES[selectedCrop] || CROP_STAGE_GUIDELINES['tomato'];
  const filteredPests = PEST_DIAGNOSTICS_DATA.filter((p) => p.cropId === selectedCrop);
  const currentPest =
    PEST_DIAGNOSTICS_DATA.find((p) => p.id === selectedPestId) ||
    filteredPests[0] ||
    PEST_DIAGNOSTICS_DATA[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>TNAU & ICAR Agronomic Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
            {language === 'ta'
              ? 'பயிர் வளர்ச்சி கால வழிகாட்டி & தாவர மருத்துவர்'
              : 'During-Crop Field Support & Plant Health Advisor'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ta'
              ? '7-நாள் மைக்ரோ வானிலை எச்சரிக்கைகள், பயிர் வளர்ச்சி நிலைகள் (நீர்/உரம் வழிகாட்டல்), பூச்சி நோய் அறிகுறிகள் & தமிழ்நாடு வேளாண் பல்கலையின் அதிகாரப்பூர்வ தீர்வுகள்.'
              : '7-day micro-weather alerts, phenological growth stage nutrition, validated pest/disease diagnostics, and direct Krishi Vigyan Kendra (KVK) scientist referral.'}
          </p>
        </div>
      </div>

      {/* Selector & Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
        {/* Crop Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
            {language === 'ta' ? 'பயிர் தேர்வு:' : 'Active Crop:'}
          </span>
          <select
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              const nextPests = PEST_DIAGNOSTICS_DATA.filter((p) => p.cropId === e.target.value);
              if (nextPests.length > 0) setSelectedPestId(nextPests[0].id);
            }}
            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ta' ? `${c.nameTa} (${c.name})` : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('weather')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              subTab === 'weather'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வானிலை & எச்சரிக்கைகள்' : 'Weather & Alerts'}</span>
          </button>

          <button
            onClick={() => setSubTab('stages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              subTab === 'stages'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வளர்ச்சி நிலைகள்' : 'Growth Stages'}</span>
          </button>

          <button
            onClick={() => setSubTab('pests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              subTab === 'pests'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'பூச்சி நோய் மருத்துவர்' : 'Pest Diagnostics'}</span>
          </button>

          <button
            onClick={() => setSubTab('experts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              subTab === 'experts'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அறிவியலாளர் தொடர்பு' : 'KVK Helpline'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: WEATHER & CONFIGURED ALERTS */}
      {subTab === 'weather' && (
        <div className="space-y-6">
          {/* Active Agronomic Weather Alert */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-amber-900">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-600 text-white font-bold">
                  {language === 'ta' ? 'செயலில் உள்ள வானிலை எச்சரிக்கை' : 'Active Weather Advisory'}
                </span>
                <span className="text-xs font-bold text-amber-800">
                  {language === 'ta' ? 'அக்டோபர் 24 - 25 வார இறுதி' : 'Oct 24-25 Weekend'}
                </span>
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                {language === 'ta'
                  ? 'மாலையில் மிதமான மழை மற்றும் இடியுடன் கூடிய மழை எதிர்பார்க்கப்படுகிறது (மழை வாய்ப்பு 80%). வயலில் தெளிப்பு மருந்துகள் அடிப்பதையும், அதிக நீர் பாய்ச்சுவதையும் தவிர்க்கவும். தக்காளி நாற்றுகள் உள்ள வயல்களில் வடிகால் வசதியை உறுதி செய்யவும்.'
                  : 'Thunderstorms and moderate rainfall forecasted over weekend (80% probability). Defer foliar sprays and urea top-dressing. Clear field drainage trenches to avoid tomato root rot and blossom drop.'}
              </p>
            </div>
          </div>

          {/* 7-Day Micro Weather Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {WEATHER_FORECAST_DATA.map((w, idx) => (
              <div
                key={w.date}
                className={`p-3.5 rounded-2xl border text-center space-y-2 transition ${
                  idx === 0
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="text-xs font-bold text-stone-600">
                  {language === 'ta' ? w.dayOfWeekTa : w.dayOfWeek}
                </div>
                <div className="text-[10px] text-stone-400">{w.date.slice(5)}</div>

                <div className="my-1 flex justify-center">
                  {w.rainfallChancePct > 50 ? (
                    <CloudRain className="w-7 h-7 text-blue-500" />
                  ) : w.rainfallChancePct > 20 ? (
                    <CloudRain className="w-7 h-7 text-stone-400" />
                  ) : (
                    <Sun className="w-7 h-7 text-amber-500" />
                  )}
                </div>

                <div className="text-sm font-extrabold text-stone-900">
                  {w.tempMax}° / <span className="text-stone-400 text-xs">{w.tempMin}°C</span>
                </div>

                <div className="text-[11px] font-semibold text-stone-600 leading-tight">
                  {language === 'ta' ? w.conditionTa : w.condition}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-center space-x-1 text-[10px] text-blue-600 font-bold">
                  <Droplets className="w-3 h-3" />
                  <span>{w.rainfallChancePct}% Rain</span>
                </div>
              </div>
            ))}
          </div>

          {/* Soil & Irrigation Guidelines Box */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? 'மண் ஈரப்பதம் & பாசன வழிகாட்டு நெறிமுறைகள் (Soil & Irrigation Protocol)'
                  : 'Soil Moisture & Drip Irrigation Protocol'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-800 block">
                  {language === 'ta' ? 'சொட்டு நீர் கால இடைவெளி' : 'Drip Irrigation Intervals'}
                </span>
                <p className="text-stone-600">
                  {language === 'ta'
                    ? 'செம்மண் நிலங்களுக்கு 2 நாட்களுக்கு ஒரு முறை 2.5 மணி நேரம் பாசனம் செய்யவும். காய் பிடிக்கும் பருவத்தில் தொடர்ச்சியான ஈரப்பதம் அவசியம்.'
                    : 'For red sandy loams: Run drip for 2.5 hours every alternate day. Avoid fluctuating dry-wet cycles.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-800 block">
                  {language === 'ta' ? 'மண் பரிசோதனை பரிந்துரை' : 'Tensiometer / Soil Check'}
                </span>
                <p className="text-stone-600">
                  {language === 'ta'
                    ? 'மண் கட்டியாக உருண்டை பிடிக்கும் அளவில் 15 செ.மீ ஆழத்தில் ஈரப்பதம் இருந்தால் நீர் பாய்ச்சலை தள்ளிப்போடலாம்.'
                    : 'Take soil at 15cm depth. If it forms a firm cohesive ball without exuding water, soil has optimal field capacity.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-emerald-800 block">
                  {language === 'ta' ? 'உரப்பாசனம் (Fertigation)' : 'Soluble Fertigation'}
                </span>
                <p className="text-stone-600">
                  {language === 'ta'
                    ? 'மழைக்கு 6 மணி நேரத்திற்கு முன் அல்லது பின் உரப்பாசனம் செய்யக்கூடாது. நீரில் கரையும் 19:19:19 உரங்களை காலை வேளையில் செலுத்தவும்.'
                    : 'Apply water-soluble 19:19:19 during early morning drip run. Avoid fertigation within 6 hours of expected rainfall.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PHENOLOGICAL GROWTH STAGES */}
      {subTab === 'stages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {language === 'ta'
                    ? `${selectedCrop.toUpperCase()} - வளர்ச்சி நிலைகள் & பராமரிப்பு காலண்டர்`
                    : `${selectedCrop.toUpperCase()} - Phenological Growth Calendar`}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ta'
                    ? 'தமிழ்நாடு வேளாண் பல்கலைக்கழக பயிர் மேலாண்மை தரவுகளின்படி தொகுக்கப்பட்டது.'
                    : 'Curated as per TNAU Agronomy Production Package of Practices.'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {stages.map((stg) => (
                <div
                  key={stg.stageNumber}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 hover:bg-stone-100/60 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        {stg.stageNumber}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {language === 'ta' ? stg.stageNameTa : stg.stageName}
                      </span>
                      <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono">
                        {stg.dayRange}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        stg.waterNeeds === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : stg.waterNeeds === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {language === 'ta'
                        ? `நீர் தேவை: ${stg.waterNeeds}`
                        : `Water Need: ${stg.waterNeeds}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
                      <p className="font-bold text-blue-700 mb-0.5 flex items-center space-x-1">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'பாசன வழிகாட்டல்' : 'Irrigation Advice'}</span>
                      </p>
                      <p className="text-stone-600">
                        {language === 'ta' ? stg.waterAdviceTa : stg.waterAdvice}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
                      <p className="font-bold text-emerald-700 mb-0.5 flex items-center space-x-1">
                        <Sprout className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'உர நிர்வாகம்' : 'Nutrient Application'}</span>
                      </p>
                      <p className="text-stone-600">
                        {language === 'ta' ? stg.fertilizerAdviceTa : stg.fertilizerAdvice}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
                      <p className="font-bold text-amber-700 mb-0.5 flex items-center space-x-1">
                        <Bug className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'கண்காணிக்க வேண்டிய பூச்சிகள்' : 'Key Risks & Pests'}</span>
                      </p>
                      <p className="text-stone-600">
                        {language === 'ta' ? stg.risksAndPestsTa : stg.risksAndPests}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PEST & DISEASE DIAGNOSTICS */}
      {subTab === 'pests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pest Selector List */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {language === 'ta' ? 'அடையாளம் காணப்பட்ட பூச்சி/நோய்கள்' : 'Validated Pest Library'}
            </h3>

            <div className="space-y-2">
              {PEST_DIAGNOSTICS_DATA.map((pest) => (
                <button
                  key={pest.id}
                  type="button"
                  onClick={() => setSelectedPestId(pest.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                    selectedPestId === pest.id
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">
                      {language === 'ta' ? pest.pestNameTa : pest.pestName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        pest.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pest.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic mt-0.5">{pest.scientificName}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">{pest.cropName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Pest Clinical Diagnosis & Solutions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold font-['Outfit'] text-stone-900">
                    {language === 'ta' ? currentPest.pestNameTa : currentPest.pestName}
                  </h3>
                  <span className="text-[10px] bg-stone-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                    TNAU Verified
                  </span>
                </div>
                <p className="text-xs text-stone-500 italic">{currentPest.scientificName}</p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  currentPest.severity === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {language === 'ta'
                  ? `தீவிரத்தன்மை: ${currentPest.severity}`
                  : `Severity: ${currentPest.severity}`}
              </span>
            </div>

            {/* Diagnostic Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {language === 'ta' ? 'அறிகுறிகள் (Visual Symptoms)' : 'Field Identification Symptoms'}
              </h4>
              <ul className="space-y-1.5">
                {(language === 'ta' ? currentPest.symptomsTa : currentPest.symptoms).map((symp, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic & Biological Control */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'ta'
                    ? 'இயற்கை மற்றும் உயிரியல் கட்டுப்பாடு (Organic / Bio-Control)'
                    : 'Organic & Bio-Control Recommendation'}
                </span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                {language === 'ta' ? currentPest.organicRemedyTa : currentPest.organicRemedy}
              </p>
            </div>

            {/* Chemical Control */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <ShieldAlert className="w-4 h-4 text-stone-600" />
                <span>
                  {language === 'ta'
                    ? 'ரசாயன கட்டுப்பாடு (CIBRC Approved Chemical Remedy)'
                    : 'Approved Chemical Control (Under Threshold Exceedance)'}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-mono">
                {language === 'ta' ? currentPest.chemicalRemedyTa : currentPest.chemicalRemedy}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SCIENTIST & KVK EXPERT REFERRAL */}
      {subTab === 'experts' && (
        <div className="space-y-6">
          {/* Kisan Call Center National Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] bg-white/20 text-white uppercase font-bold px-2 py-0.5 rounded">
                Govt. of India Toll-Free
              </span>
              <h3 className="text-xl font-bold font-['Outfit']">
                Kisan Call Center: Dial 1551 (கிசான் இலவச அழைப்பு மையம்)
              </h3>
              <p className="text-xs text-emerald-100">
                {language === 'ta'
                  ? 'வாரத்தின் 7 நாட்களும் காலை 6:00 மணி முதல் இரவு 10:00 மணி வரை தமிழில் வேளாண் வல்லுநர்களிடம் நேரடியாகப் பேசலாம்.'
                  : 'Speak directly with agricultural scientists in Tamil/English from 6:00 AM to 10:00 PM daily.'}
              </p>
            </div>
            <a
              href="tel:1551"
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-sm flex items-center space-x-2 shadow-lg hover:bg-emerald-50 transition shrink-0"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'இப்போதே அழைக்க: 1551' : 'Call 1551 Toll-Free'}</span>
            </a>
          </div>

          {/* District KVK Centers Directory */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                {language === 'ta'
                  ? 'மாவட்ட வேளாண் அறிவியல் நிலையங்கள் (KVK Expert Directory)'
                  : 'District Krishi Vigyan Kendra (KVK) Scientist Directory'}
              </h3>
              <span className="text-xs text-stone-500">ICAR & TNAU Affiliated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KVK_CENTERS_DATA.map((kvk) => (
                <div
                  key={kvk.district}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {language === 'ta' ? kvk.districtTa : kvk.district}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-1">
                        {language === 'ta' ? kvk.centerNameTa : kvk.centerName}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <p className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-900">Scientist In-Charge:</span>
                      <span>{kvk.scientistInCharge}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{language === 'ta' ? kvk.addressTa : kvk.address}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${kvk.phone.split('/')[0].trim()}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{kvk.phone.split('/')[0].trim()}</span>
                    </a>
                    <span className="text-stone-400 font-mono text-[11px]">{kvk.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
