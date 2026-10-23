import React, { useState } from 'react';
import {
  ShieldAlert,
  Truck,
  Warehouse,
  Coins,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, PostHarvestScenarioInput } from '../../types';
import { CROPS, MANDIS } from '../../data/agriData';
import { evaluatePostHarvestScenarios } from '../../utils/calculations';
import { t } from '../../utils/translations';

interface PostHarvestPlannerProps {
  language: Language;
  selectedMandiId: string;
}

export const PostHarvestPlanner: React.FC<PostHarvestPlannerProps> = ({
  language,
  selectedMandiId,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [harvestQty, setHarvestQty] = useState<number>(60);
  const [alternateMandiId, setAlternateMandiId] = useState<string>('koyambedu');
  const [storageDays, setStorageDays] = useState<number>(21);

  const currentCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const localMandi = MANDIS.find((m) => m.id === selectedMandiId) || MANDIS[0];

  const currentLocalPrice = Math.round(currentCrop.minMsp * 1.25);

  const scenarios = evaluatePostHarvestScenarios({
    cropId: selectedCropId,
    harvestQuantityQuintals: harvestQty,
    localMandiId: selectedMandiId,
    currentLocalPrice,
    selectedAlternateMandiId: alternateMandiId,
    storagePeriodDays: storageDays,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Feature 6 • Post-Harvest Rescue & Arbitrage Optimizer</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'rescueHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'rescueSub')}
        </p>
      </div>

      {/* Scenario Parameters Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'அறுவடை செய்யப்பட்ட பயிர்:' : 'Harvested Crop:'}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.nameTa : c.name} ({c.perishability} Perishable)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'அறுவடை அளவு (குவிண்டால்):' : 'Harvest Lot Size (Quintals):'}
            </label>
            <input
              type="number"
              min="5"
              max="1000"
              value={harvestQty}
              onChange={(e) => setHarvestQty(parseInt(e.target.value) || 10)}
              className="w-full text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'மாற்று உயர்-விலை மண்டி:' : 'Alternate Higher-Spread Mandi:'}
            </label>
            <select
              value={alternateMandiId}
              onChange={(e) => setAlternateMandiId(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {MANDIS.filter((m) => m.id !== selectedMandiId).map((m) => (
                <option key={m.id} value={m.id}>
                  {language === 'ta' ? m.nameTa : m.name} ({m.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'சேமிப்பு காலம் (நாட்கள்):' : 'Cold Storage Period (Days):'}
            </label>
            <select
              value={storageDays}
              onChange={(e) => setStorageDays(parseInt(e.target.value))}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="15">15 Days (Short Glut Clearance)</option>
              <option value="21">21 Days (3-Week Rebound)</option>
              <option value="30">30 Days (1 Month Full Recovery)</option>
              <option value="45">45 Days (Extended Holding)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3 Comparative Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scen) => {
          const isBest = scen.recommendationRating === 'Best Value';
          return (
            <div
              key={scen.id}
              className={`rounded-2xl p-5 shadow-sm border-2 transition flex flex-col justify-between ${
                isBest
                  ? 'bg-emerald-50/60 border-emerald-500'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {scen.id === 'immediate'
                      ? 'Strategy A'
                      : scen.id === 'transport'
                      ? 'Strategy B'
                      : 'Strategy C'}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isBest
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isBest
                      ? language === 'ta'
                        ? '★ சிறந்த தேர்வு (Best Yield)'
                        : '★ Recommended Strategy'
                      : scen.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1 font-['Outfit']">
                  {language === 'ta' ? scen.titleTa : scen.title}
                </h3>

                {/* Net Financial Return */}
                <div className="my-4 p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    {t(language, 'rescueNetReturn')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit'] mt-0.5">
                    ₹{scen.netReturn.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">
                    Effective Realization: ₹{scen.effectivePricePerQuintal} / quintal
                  </div>
                </div>

                {/* Costs Breakdown */}
                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/60 pt-3 mb-4">
                  <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'செலவு விவரங்கள்:' : 'Cost Breakdown:'}
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Value:</span>
                    <span className="font-semibold text-stone-800">
                      ₹{scen.grossRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {scen.costBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-stone-500">
                      <span>{language === 'ta' ? item.itemTa : item.item}</span>
                      <span className="font-medium text-rose-600">
                        -₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-stone-800 pt-1 border-t border-stone-100">
                    <span>Total Deductions:</span>
                    <span className="text-rose-700">
                      ₹{scen.totalCosts.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Risks */}
                <div className="text-xs text-stone-600 border-t border-stone-200/60 pt-3">
                  <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'கவனிக்க வேண்டிய அபாயங்கள்:' : 'Key Assumptions & Risks:'}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-500">
                    {(language === 'ta' ? scen.risksTa : scen.risks).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Local Verifications Required (Anti-Hallucination Policy) */}
              <div className="mt-4 pt-3 border-t border-stone-200/80 bg-stone-50/80 -mx-5 -mb-5 p-4 rounded-b-2xl text-[11px]">
                <div className="font-bold text-stone-700 mb-1 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-stone-500" />
                  <span>
                    {language === 'ta' ? 'நேரடியாக சரிபார்க்கவும்:' : 'Must Verify Locally:'}
                  </span>
                </div>
                <ul className="text-stone-500 space-y-0.5">
                  {(language === 'ta' ? scen.requiredVerificationsTa : scen.requiredVerifications).map(
                    (v, i) => (
                      <li key={i}>• {v}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ground Truth & Logistics Reality Check */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-stone-800">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{t(language, 'rescueVerificationNote')}</span>
        </div>
        <p className="leading-relaxed">
          {language === 'ta'
            ? 'அக்ரிஷீல்ட் உருவகப்படுத்தப்பட்ட தரகர்களையோ அல்லது கற்பனையான கிடங்குகளையோ பட்டியலிடாது. உழவர்கள் தங்களின் உள்ளூர் கிராம பஞ்சாயத்து, வேளாண் விற்பனைக்குழு அல்லது உழவர் உற்பத்தியாளர் நிறுவன (FPO) பிரதிநிதியைத் தொடர்புகொண்டு வாடகை லாரி மற்றும் அரசு குளிர்பதன கிடங்கு இருப்பை உறுதி செய்ய வேண்டும்.'
            : 'AgriShield transparently computes logistics arbitrage economics without generating fictional business listings. Farmers must contact their local Agricultural Marketing Committee (APMC) secretary or FPO aggregator to confirm physical cold store bay space and freight agreements prior to transit.'}
        </p>
      </div>
    </div>
  );
};
