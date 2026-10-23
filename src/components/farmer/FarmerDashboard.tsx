import React from 'react';
import {
  Sprout,
  BarChart3,
  Calculator,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Info,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../../types';
import { CROPS, MANDIS } from '../../data/agriData';
import { t } from '../../utils/translations';

interface FarmerDashboardProps {
  language: Language;
  onNavigate: (tab: string) => void;
  selectedMandiId: string;
  setSelectedMandiId: (id: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  onNavigate,
  selectedMandiId,
  setSelectedMandiId,
}) => {
  const currentMandi = MANDIS.find((m) => m.id === selectedMandiId) || MANDIS[0];

  // Quick ticker prices for popular crops at selected mandi
  const tickerItems = [
    { name: language === 'ta' ? 'தக்காளி' : 'Tomato', price: '₹1,450', unit: 'qtl', change: -8.5, isDown: true },
    { name: language === 'ta' ? 'வெங்காயம்' : 'Onion', price: '₹2,100', unit: 'qtl', change: +3.2, isDown: false },
    { name: language === 'ta' ? 'நெல் (Paddy)' : 'Paddy (Rice)', price: '₹2,340', unit: 'qtl', change: +1.1, isDown: false },
    { name: language === 'ta' ? 'பருத்தி' : 'Cotton', price: '₹6,850', unit: 'qtl', change: -1.4, isDown: true },
    { name: language === 'ta' ? 'மிளகாய்' : 'Chilli', price: '₹8,200', unit: 'qtl', change: +4.6, isDown: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Farmer Welcome & Orientation Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {language === 'ta'
                ? 'விவசாயிகளின் நலனுக்கான AI வழிகாட்டி'
                : 'Empowering Farmers with Transparent Market AI'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit'] mb-2">
            {language === 'ta'
              ? 'வணக்கம், உழவர் பெருமக்களே!'
              : 'Welcome to AgriShield'}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-4">
            {language === 'ta'
              ? 'சரியான பயிரை தேர்வு செய்யுங்கள், இன்றைய சந்தை விலைகளை ஒப்பிடுங்கள், உற்பத்தி செலவு மற்றும் நிகர லாபத்தை கணக்கிடுங்கள், விலை வீழ்ச்சியிலிருந்து உங்கள் விளைபொருளை பாதுகாத்து கூடுதல் லாபம் ஈட்டுங்கள்.'
              : 'Choose the most profitable crop before sowing, track live verified APMC mandi prices, calculate net earnings with break-even points, and safeguard your harvest against unexpected market crashes.'}
          </p>

          {/* Quick Mandi Selector & Freshness */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center space-x-2 bg-stone-900/60 backdrop-blur px-3 py-2 rounded-xl border border-emerald-500/30 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-300 font-medium">
                {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மண்டி:' : 'Active Mandi:'}
              </span>
              <select
                value={selectedMandiId}
                onChange={(e) => setSelectedMandiId(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {MANDIS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-stone-800 text-white">
                    {language === 'ta' ? m.nameTa : m.name} ({m.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-emerald-200 bg-emerald-950/70 px-3 py-2 rounded-xl border border-emerald-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {language === 'ta' ? 'தரவு புதுப்பிப்பு: இன்று காலை 08:30 மணி' : 'Last Refreshed: Today, 08:30 AM IST'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Market Price Ticker */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {language === 'ta'
                ? `இன்றைய மாதிரி விலை நிலவரம் (${currentMandi.nameTa})`
                : `Today's Benchmark Modal Prices (${currentMandi.name})`}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('mandi')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition"
          >
            <span>{language === 'ta' ? 'அனைத்து சந்தைகள்' : 'View Full Mandi Explorer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tickerItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-lg p-2.5 border border-stone-200/80 hover:border-emerald-300 transition"
            >
              <div className="text-xs font-semibold text-stone-600 truncate">{item.name}</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-extrabold text-stone-900">{item.price}</span>
                <span className="text-[10px] text-stone-400">/{item.unit}</span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                {item.isDown ? (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                )}
                <span className={`text-[11px] font-bold ${item.isDown ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                </span>
                <span className="text-[10px] text-stone-400">24h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOUR PRIMARY ACTION CARDS (Core Prompt Requirement) */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-extrabold text-stone-900 font-['Outfit']">
            {language === 'ta' ? 'நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?' : 'What would you like to do today?'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'ta'
              ? 'விவசாய முடிவுகளுக்கான 4 முக்கிய சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்'
              : 'Select one of the 4 core farmer decision services below'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Choose a Crop */}
          <div
            onClick={() => onNavigate('advisory')}
            className="group bg-white rounded-2xl p-5 border-2 border-emerald-600/30 hover:border-emerald-600 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Step 1 • Pre-Sowing
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 mb-1.5 font-['Outfit']">
                {t(language, 'card1Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t(language, 'card1Sub')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>{t(language, 'card1Action')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Check Mandi Prices */}
          <div
            onClick={() => onNavigate('mandi')}
            className="group bg-white rounded-2xl p-5 border-2 border-stone-200 hover:border-emerald-600 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Step 2 • Market Intelligence
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 mb-1.5 font-['Outfit']">
                {t(language, 'card2Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t(language, 'card2Sub')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>{t(language, 'card2Action')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Calculate Expected Profit */}
          <div
            onClick={() => onNavigate('profit')}
            className="group bg-white rounded-2xl p-5 border-2 border-stone-200 hover:border-emerald-600 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Calculator className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Step 3 • Financial Planning
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 mb-1.5 font-['Outfit']">
                {t(language, 'card3Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t(language, 'card3Sub')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>{t(language, 'card3Action')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Plan After Harvest */}
          <div
            onClick={() => onNavigate('rescue')}
            className="group bg-white rounded-2xl p-5 border-2 border-rose-200 hover:border-rose-600 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Step 4 • Rescue & Arbitrage
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 mb-1.5 font-['Outfit']">
                {t(language, 'card4Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t(language, 'card4Sub')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-700 group-hover:text-rose-800">
              <span>{t(language, 'card4Action')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* High-Priority Crash Risk Alert Callout */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                  {language === 'ta' ? 'எச்சரிக்கை சமிக்கை' : 'Early Warning Signal'}
                </span>
                <span className="text-xs text-amber-900 font-semibold">
                  {currentMandi.name}
                </span>
              </div>
              <h4 className="text-base font-bold text-stone-900 mt-1">
                {language === 'ta'
                  ? 'தக்காளி: அடுத்த 7 நாட்களில் 24% விலை வீழ்ச்சி சாத்தியக்கூறு'
                  : 'Tomato: High Supply Influx Alert - 24% Potential Price Drop Over 7 Days'}
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                {language === 'ta'
                  ? 'உள்ளூர் சந்தைக்கு வரத்து 35% அதிகரித்துள்ளது. உடனடி அறுவடையை பிரித்து செய்ய அல்லது வெளிமாவட்ட மண்டிகளுக்கு கொண்டு செல்ல பரிந்துரைக்கப்படுகிறது.'
                  : 'Daily arrival volumes have surged 35% above 30-day baseline moving average. Consider staggered harvesting or checking metropolitan market spreads.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onNavigate('risk')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
            >
              {language === 'ta' ? 'முழு எச்சரிக்கை விவரம்' : 'View Risk Details'}
            </button>
            <button
              onClick={() => onNavigate('forecast')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 transition"
            >
              {language === 'ta' ? '7-நாள் விலை கணிப்பு' : '7-Day Price Forecast'}
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Agricultural & Limitations Disclaimer */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-stone-600 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-stone-800 mb-0.5">
            {language === 'ta' ? 'வெளிப்படைத்தன்மை & விவசாய வழிகாட்டுதல் நெறிமுறை' : 'Transparency & Decision-Support Notice'}
          </div>
          <p className="leading-relaxed">
            {language === 'ta'
              ? 'அக்ரிஷீல்ட் கணிப்புகள் மற்றும் ஆலோசனைகள் அரசு அக்மார்க்நெட் வரலாற்று தரவுகள் மற்றும் இயந்திர கற்றல் மாதிரிகளை அடிப்படையாகக் கொண்ட புள்ளியியல் வழிகாட்டுதலாகும். இது உழவர்களின் சொந்த கள ஆய்வுக்கு மாற்றாகாது. எந்தவொரு விற்பனை முடிவை எடுக்கும் முன்பும் உள்ளூர் வியாபாரிகள், மண்டி முகவர்கள் மற்றும் வானிலை நிலவரங்களை நேரடியாக சரிபார்த்துக்கொள்ளவும்.'
              : 'AgriShield predictions, advisories, and profit calculations are probabilistic decision-support signals grounded in verified Agmarknet historical trading records and machine learning models. They do not constitute guaranteed financial transactions. Always verify local market conditions, truck freight rates, and grading standards before dispatching produce.'}
          </p>
        </div>
      </div>
    </div>
  );
};
