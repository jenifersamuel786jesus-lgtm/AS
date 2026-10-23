import React, { useState } from 'react';
import {
  Calculator,
  Coins,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { Language, ProfitCalcInput } from '../../types';
import { CROPS } from '../../data/agriData';
import { calculateNetEarnings } from '../../utils/calculations';
import { t } from '../../utils/translations';

interface ProfitCalculatorProps {
  language: Language;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ language }) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');

  const defaultCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];

  const [inputs, setInputs] = useState<ProfitCalcInput>({
    landAreaAcres: 1,
    expectedYieldQuintalsPerAcre: defaultCrop.avgYieldPerAcre,
    expectedSellingPricePerQuintal: Math.round(defaultCrop.minMsp * 1.25),
    // Cultivation Expenses
    seedsCost: 4500,
    fertilizerCost: 8500,
    pesticideCost: 4200,
    labourCost: 18000,
    machineryCost: 6500,
    irrigationCost: 3500,
    // Selling & Logistics
    harvestingPackagingCost: 7500,
    transportCost: 3200,
    mandiCommissionCost: 2800,
    otherCost: 1200,
  });

  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const c = CROPS.find((item) => item.id === cropId) || CROPS[0];
    setInputs((prev) => ({
      ...prev,
      expectedYieldQuintalsPerAcre: c.avgYieldPerAcre,
      expectedSellingPricePerQuintal: Math.round(c.minMsp * 1.25),
      seedsCost: Math.round(c.avgCostPerAcre * 0.1),
      fertilizerCost: Math.round(c.avgCostPerAcre * 0.2),
      pesticideCost: Math.round(c.avgCostPerAcre * 0.12),
      labourCost: Math.round(c.avgCostPerAcre * 0.35),
      machineryCost: Math.round(c.avgCostPerAcre * 0.13),
      irrigationCost: Math.round(c.avgCostPerAcre * 0.1),
    }));
  };

  const results = calculateNetEarnings(inputs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Feature 5 • Financial Planning & Break-Even Analysis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'profitHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'profitSub')}
        </p>
      </div>

      {/* Preset Auto-Filler Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-stone-700">
            {language === 'ta' ? 'பயிர் முன்வடிவம்:' : 'Load Benchmarks For:'}
          </span>
          <select
            value={selectedCropId}
            onChange={(e) => handleCropChange(e.target.value)}
            className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ta' ? c.nameTa : c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-stone-500">
          {language === 'ta'
            ? 'அரசு வேளாண் பல்கலைக்கழக சாகுபடி செலவு வழிகாட்டுதலின்படி நிரப்பப்பட்டது'
            : 'Pre-filled with State Agricultural University cost benchmarks'}
        </span>
      </div>

      {/* Dual Input Section: Field Expenses & Post-Harvest Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultivation Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {t(language, 'sectionCultivation')}
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Subtotal: ₹{results.totalCultivationCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'labelLandArea')}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.25"
                value={inputs.landAreaAcres}
                onChange={(e) =>
                  setInputs({ ...inputs, landAreaAcres: parseFloat(e.target.value) || 1 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {language === 'ta' ? 'விளைச்சல் (குவி/ஏக்கர்)' : 'Yield (Quintals/Acre)'}
              </label>
              <input
                type="number"
                min="1"
                value={inputs.expectedYieldQuintalsPerAcre}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    expectedYieldQuintalsPerAcre: parseFloat(e.target.value) || 1,
                  })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldSeeds')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.seedsCost}
                onChange={(e) =>
                  setInputs({ ...inputs, seedsCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldFertilizers')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.fertilizerCost}
                onChange={(e) =>
                  setInputs({ ...inputs, fertilizerCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldPesticides')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.pesticideCost}
                onChange={(e) =>
                  setInputs({ ...inputs, pesticideCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldLabour')}
              </label>
              <input
                type="number"
                step="1000"
                value={inputs.labourCost}
                onChange={(e) =>
                  setInputs({ ...inputs, labourCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Machinery & Tractor
              </label>
              <input
                type="number"
                step="500"
                value={inputs.machineryCost}
                onChange={(e) =>
                  setInputs({ ...inputs, machineryCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldIrrigation')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.irrigationCost}
                onChange={(e) =>
                  setInputs({ ...inputs, irrigationCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Post-Harvest & Marketing Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {t(language, 'sectionSelling')}
            </h3>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Subtotal: ₹{results.totalSellingCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block font-bold text-stone-800 mb-1">
                {language === 'ta' ? 'எதிர்பார்க்கும் விற்பனை விலை (₹/குவிண்டால்)' : 'Target Mandi Selling Price (₹/Quintal)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-500 font-bold">₹</span>
                <input
                  type="number"
                  step="50"
                  value={inputs.expectedSellingPricePerQuintal}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      expectedSellingPricePerQuintal: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-7 bg-emerald-50 border border-emerald-400 rounded-lg p-2 font-extrabold text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldHarvest')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.harvestingPackagingCost}
                onChange={(e) =>
                  setInputs({ ...inputs, harvestingPackagingCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldTransport')}
              </label>
              <input
                type="number"
                step="500"
                value={inputs.transportCost}
                onChange={(e) =>
                  setInputs({ ...inputs, transportCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t(language, 'fieldCommission')}
              </label>
              <input
                type="number"
                step="200"
                value={inputs.mandiCommissionCost}
                onChange={(e) =>
                  setInputs({ ...inputs, mandiCommissionCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Miscellaneous / Contingency
              </label>
              <input
                type="number"
                step="200"
                value={inputs.otherCost}
                onChange={(e) =>
                  setInputs({ ...inputs, otherCost: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Scorecard of Financial Outputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'resultTotalExpense')}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 font-['Outfit']">
            ₹{results.totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Total out-of-pocket investment
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'resultGrossRevenue')}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 font-['Outfit']">
            ₹{results.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {results.totalYieldQuintals} qtl @ ₹{inputs.expectedSellingPricePerQuintal}
          </div>
        </div>

        {/* Net Profit */}
        <div
          className={`rounded-2xl p-4 shadow-sm border-2 ${
            results.netProfit >= 0
              ? 'bg-emerald-50/70 border-emerald-500/60'
              : 'bg-rose-50/70 border-rose-500/60'
          }`}
        >
          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
            {t(language, 'resultNetProfit')}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold mt-1 font-['Outfit'] ${
              results.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {results.netProfit >= 0 ? '+' : ''}₹{results.netProfit.toLocaleString('en-IN')}
          </div>
          <div
            className={`text-[11px] font-bold mt-0.5 ${
              results.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            Margin: {results.profitMarginPct}%
          </div>
        </div>

        {/* Break-Even Selling Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-300 bg-amber-50/40">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            {t(language, 'resultBreakEven')}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-900 mt-1 font-['Outfit']">
            ₹{results.breakEvenSellingPrice} / qtl
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-0.5">
            Zero profit-loss threshold
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            {t(language, 'sensitivityTitle')}
          </h3>
          <span className="text-[11px] text-stone-400">
            Stress-testing profits under unexpected price swings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Market Condition</th>
                <th className="py-2.5 px-4">Selling Price (₹/qtl)</th>
                <th className="py-2.5 px-4">Gross Revenue</th>
                <th className="py-2.5 px-4">Net Realization</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {results.sensitivityMatrix.map((row) => (
                <tr
                  key={row.priceDeltaPct}
                  className={`hover:bg-stone-50 transition ${
                    row.priceDeltaPct === 0 ? 'bg-amber-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-2.5 px-4">
                    {row.priceDeltaPct === 0
                      ? 'Base Case (Target)'
                      : row.priceDeltaPct < 0
                      ? `${row.priceDeltaPct}% Price Drop (Mandi Slump)`
                      : `+${row.priceDeltaPct}% Price Premium (Shortage)`}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-stone-800">
                    ₹{row.sellingPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-stone-700">
                    ₹{row.revenue.toLocaleString('en-IN')}
                  </td>
                  <td
                    className={`py-2.5 px-4 font-extrabold ${
                      row.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {row.netProfit >= 0 ? '+' : ''}₹{row.netProfit.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4">
                    {row.netProfit >= 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Profitable
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Loss Alert
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
