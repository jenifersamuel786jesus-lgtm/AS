import React, { useState } from 'react';
import {
  Sprout,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Droplets,
  Coins,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { Language, PreSowingInput } from '../../types';
import { MANDIS } from '../../data/agriData';
import { evaluateCropSuitability } from '../../utils/calculations';
import { t } from '../../utils/translations';

interface PreSowingAdvisoryProps {
  language: Language;
}

export const PreSowingAdvisory: React.FC<PreSowingAdvisoryProps> = ({ language }) => {
  const [formData, setFormData] = useState<PreSowingInput>({
    state: 'Tamil Nadu',
    district: 'Dindigul',
    soilType: 'Red Loamy',
    irrigation: 'Drip / Sprinkler',
    landArea: 2,
    landUnit: 'acres',
    season: 'Kharif',
    budget: 80000,
    selectedCrops: [],
  });

  const [hasEvaluated, setHasEvaluated] = useState(true);

  const results = evaluateCropSuitability(formData);

  const soilTypes = ['Red Loamy', 'Black Cotton', 'Clay Loam', 'Sandy Loam', 'Alluvial'];
  const irrigationTypes = ['Drip / Sprinkler', 'Borewell / Open Well', 'Canal Irrigation', 'Rainfed'];
  const seasons: ('Kharif' | 'Rabi' | 'Zaid')[] = ['Kharif', 'Rabi', 'Zaid'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Sprout className="w-4 h-4" />
          <span>Feature 1 • Scientific Crop Selection</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'advisoryHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'advisorySub')}
        </p>
      </div>

      {/* Input Parameters Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200">
        <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-stone-100">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-stone-800">
            {language === 'ta' ? 'உங்கள் நிலத்தின் விவரங்கள்' : 'Farm & Cultivation Parameters'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State & District */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelState')} & {t(language, 'labelDistrict')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
              </select>

              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="District"
              />
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelSoil')}
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            >
              {soilTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelIrrigation')}
            </label>
            <select
              value={formData.irrigation}
              onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            >
              {irrigationTypes.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelSeason')}
            </label>
            <select
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value as 'Kharif' | 'Rabi' | 'Zaid' })
              }
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            >
              {seasons.map((sn) => (
                <option key={sn} value={sn}>
                  {sn} ({sn === 'Kharif' ? 'Monsoon' : sn === 'Rabi' ? 'Winter' : 'Summer'})
                </option>
              ))}
            </select>
          </div>

          {/* Land Area */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelLandArea')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.25"
                max="50"
                step="0.25"
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: parseFloat(e.target.value) || 1 })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs text-stone-500 font-semibold">{t(language, 'acres')}</span>
            </div>
          </div>

          {/* Working Capital Budget */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'labelBudget')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-stone-500 font-bold">₹</span>
              <input
                type="number"
                step="5000"
                min="10000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 20000 })}
                className="w-full pl-7 text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={() => setHasEvaluated(true)}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t(language, 'btnEvaluate')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Results Table */}
      {hasEvaluated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-800">
              {language === 'ta'
                ? `மதிப்பீட்டு முடிவுகள் (${formData.landArea} ஏக்கர் நிலப்பரப்பிற்கு)`
                : `Comparative Feasibility Analysis (For ${formData.landArea} Acres)`}
            </h3>
            <span className="text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full font-medium">
              Ranked by Multi-Criteria Agronomic & Financial Feasibility
            </span>
          </div>

          {/* Table on larger screens, Cards on mobile */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">{t(language, 'colCrop')}</th>
                    <th className="py-3 px-4">{t(language, 'colSuitability')}</th>
                    <th className="py-3 px-4">{t(language, 'colYield')}</th>
                    <th className="py-3 px-4">{t(language, 'colCost')}</th>
                    <th className="py-3 px-4">{t(language, 'colRevenue')}</th>
                    <th className="py-3 px-4">{t(language, 'colNetProfit')}</th>
                    <th className="py-3 px-4">Break-even (₹/qtl)</th>
                    <th className="py-3 px-4">{t(language, 'colRisk')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {results.map((res, index) => {
                    const isTop = index === 0;
                    return (
                      <tr
                        key={res.cropId}
                        className={`hover:bg-stone-50/80 transition ${
                          isTop ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 text-sm">
                            {language === 'ta' ? res.cropNameTa : res.cropName}
                          </div>
                          {isTop && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded">
                              ★ Top Recommended
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-12 bg-stone-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  res.suitabilityScore >= 80
                                    ? 'bg-emerald-600'
                                    : res.suitabilityScore >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${res.suitabilityScore}%` }}
                              ></div>
                            </div>
                            <span className="font-extrabold text-stone-800">
                              {res.suitabilityScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-700">
                          {res.expectedYieldQuintals} {t(language, 'quintals')}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-medium">
                          ₹{res.estimatedCultivationCost.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 font-semibold">
                          ₹{res.expectedGrossRevenue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                          ₹{res.estimatedNetProfit.toLocaleString('en-IN')}
                          <div className="text-[10px] font-medium text-emerald-600">
                            ROI: +{res.roiPct}%
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 font-medium">
                          ₹{res.breakEvenPrice}/qtl
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              res.riskFactor === 'Low'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.riskFactor === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {res.riskFactor} Risk
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Caveats & Agronomic Details for Top Crop */}
            <div className="bg-stone-50 p-4 border-t border-stone-200">
              <div className="flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-600">
                  <span className="font-bold text-stone-800">
                    {language === 'ta' ? 'விவசாய கவனக்குறிப்பு:' : 'Agronomic Guidance & Caveats for Best Choice:'}
                  </span>{' '}
                  {language === 'ta' ? results[0].caveatsTa.join(' ') : results[0].caveats.join(' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
