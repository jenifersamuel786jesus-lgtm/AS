import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { Language } from '../../types';
import { CROPS, MANDIS, MODEL_METRICS } from '../../data/agriData';
import { generateForecast } from '../../utils/calculations';
import { t } from '../../utils/translations';

interface PriceForecastModuleProps {
  language: Language;
  selectedMandiId: string;
}

export const PriceForecastModule: React.FC<PriceForecastModuleProps> = ({
  language,
  selectedMandiId,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');

  const currentCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const currentMandi = MANDIS.find((m) => m.id === selectedMandiId) || MANDIS[0];

  const currentBasePrice = Math.round(currentCrop.minMsp * 1.25);
  const forecastDays = generateForecast(selectedCropId, currentBasePrice);

  const chartData = forecastDays.map((d) => ({
    day: `Day ${d.day} (${d.date})`,
    predicted: d.predictedPrice,
    lower: d.lowerBound,
    upper: d.upperBound,
    mae: d.maeTolerance,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>Feature 3 • ML Price Forecasting (Gradient Boosting)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'forecastHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'forecastSub')}
        </p>
      </div>

      {/* Commodity Selector Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-stone-700">
            {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்:' : 'Select Commodity for Forecast:'}
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ta' ? c.nameTa : c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 font-medium">Market:</span>
          <span className="font-bold text-stone-800">{currentMandi.name}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Out-of-Time Validated
          </span>
        </div>
      </div>

      {/* Forecast Chart with Confidence Intervals */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-800">
              {currentCrop.name} 7-Day Predicted Trajectory & 90% Bounds
            </h3>
            <p className="text-xs text-stone-500">
              Evaluated on unseen test period (2026-01-24 to 2026-03-24)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-stone-700">Test MAE: </span>
            <span className="text-xs font-extrabold text-emerald-700">₹116.21 / qtl</span>
            <span className="text-xs text-stone-400 ml-1.5">(R²: 0.9836)</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
                formatter={(val: any, name?: any) => [
                  `₹${val}/qtl`,
                  name === 'predicted'
                    ? 'Predicted Modal'
                    : name === 'lower'
                    ? '90% Lower Bound'
                    : name === 'upper'
                    ? '90% Upper Bound'
                    : String(name || ''),
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="#dcfce7"
                fillOpacity={0.6}
                name="upper"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
                name="lower"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4, fill: '#15803d' }}
                name="predicted"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Day Detailed Prediction Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            {t(language, 'forecastTableDay')} Breakdown
          </h3>
          <span className="text-[11px] text-stone-500">
            Model: Gradient_Boosting_Regressor (v1.2.0-production)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">{t(language, 'forecastTableDay')}</th>
                <th className="py-2.5 px-4">{t(language, 'forecastTablePrice')}</th>
                <th className="py-2.5 px-4">{t(language, 'forecastTableInterval')}</th>
                <th className="py-2.5 px-4">{t(language, 'forecastTableTolerance')}</th>
                <th className="py-2.5 px-4">Expected Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {forecastDays.map((f) => (
                <tr key={f.day} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4 font-bold text-stone-800">
                    Day +{f.day} ({f.date})
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-800 text-sm">
                    ₹{f.predictedPrice.toLocaleString('en-IN')} / qtl
                    <span className="text-[10px] font-normal text-stone-400 ml-1.5">
                      (₹{(f.predictedPrice / 100).toFixed(1)}/kg)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">
                    ₹{f.lowerBound} — ₹{f.upperBound}
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    ± ₹{f.maeTolerance} / qtl (MAE)
                  </td>
                  <td className="py-3 px-4">
                    {f.expectedTrend === 'down' ? (
                      <span className="inline-flex items-center space-x-1 text-rose-600 font-bold">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Down</span>
                      </span>
                    ) : f.expectedTrend === 'up' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Upward</span>
                      </span>
                    ) : (
                      <span className="text-stone-500 font-bold">Stable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer Footer */}
        <div className="bg-amber-50 p-4 border-t border-amber-200/60 text-xs text-amber-900 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t(language, 'forecastDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};
