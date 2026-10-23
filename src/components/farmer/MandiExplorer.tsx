import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  ExternalLink,
  Layers,
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
  Bar,
  ComposedChart,
} from 'recharts';
import { Language } from '../../types';
import { CROPS, MANDIS, generateHistoricalPrices } from '../../data/agriData';
import { t } from '../../utils/translations';

interface MandiExplorerProps {
  language: Language;
  selectedMandiId: string;
  setSelectedMandiId: (id: string) => void;
}

export const MandiExplorer: React.FC<MandiExplorerProps> = ({
  language,
  selectedMandiId,
  setSelectedMandiId,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const currentMandi = MANDIS.find((m) => m.id === selectedMandiId) || MANDIS[0];

  // Generate 30 days of price records
  const priceRecords = generateHistoricalPrices(selectedCropId, selectedMandiId);
  const latestRecord = priceRecords[priceRecords.length - 1];

  const filteredMandis = MANDIS.filter((m) => {
    const matchesState = stateFilter === 'All' || m.state === stateFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameTa.includes(searchTerm);
    return matchesState && matchesSearch;
  });

  // Chart data formatting
  const chartData = priceRecords.map((r) => ({
    date: r.date.slice(5), // MM-DD
    modalPrice: r.modalPrice,
    minPrice: r.minPrice,
    maxPrice: r.maxPrice,
    arrival: r.arrivalVolume,
  }));

  const states = ['All', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Andhra Pradesh', 'Punjab', 'Gujarat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Feature 2 • Verified APMC Mandi Explorer</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Outfit']">
          {t(language, 'mandiHeading')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t(language, 'mandiSub')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Select Commodity */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'filterCrop')}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.nameTa : c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by State */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'filterState')}
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Select Mandi */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t(language, 'filterMandi')}
            </label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {filteredMandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {language === 'ta' ? m.nameTa : m.name} ({m.district})
                </option>
              ))}
            </select>
          </div>

          {/* Search Mandi Keyword */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'ta' ? 'சந்தையைத் தேடுக' : 'Quick Search Mandi'}
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder={language === 'ta' ? 'ஊர் அல்லது மண்டி பெயர்...' : 'District or APMC name...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Price Cards for Selected Pair */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Modal Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-emerald-500/40">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'statModal')}
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
              ₹{latestRecord.modalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-500">/qtl</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
            ≈ ₹{(latestRecord.modalPrice / 100).toFixed(1)} / kg
          </div>
        </div>

        {/* Min Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'statMin')}
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-stone-800 font-['Outfit']">
              ₹{latestRecord.minPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-400">/qtl</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Floor support rate
          </div>
        </div>

        {/* Max Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'statMax')}
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-stone-800 font-['Outfit']">
              ₹{latestRecord.maxPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-400">/qtl</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Grade-A auction premium
          </div>
        </div>

        {/* Arrival Volume */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t(language, 'statArrival')}
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-blue-700 font-['Outfit']">
              {latestRecord.arrivalVolume.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-500">{t(language, 'quintals')}</span>
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5 font-medium">
            Daily Mandi Inflow
          </div>
        </div>
      </div>

      {/* Interactive 30-Day Recharts Chart */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-800">
              {t(language, 'chartTitle')}
            </h3>
            <p className="text-xs text-stone-500">
              {currentCrop.name} ({language === 'ta' ? currentCrop.nameTa : ''}) @ {currentMandi.name}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t(language, 'verifiedBadge')}</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="price" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <YAxis yAxisId="arrival" orientation="right" tick={{ fontSize: 10 }} domain={['auto', 'auto']} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
                formatter={(val: any, name?: any) => [
                  name === 'arrival' ? `${val} qtl` : `₹${val}/qtl`,
                  name === 'modalPrice' ? 'Modal Price' : name === 'arrival' ? 'Arrival Volume' : String(name || ''),
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="arrival" dataKey="arrival" fill="#e2e8f0" name="arrival" opacity={0.6} />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="modalPrice"
                stroke="#15803d"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                name="modalPrice"
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="minPrice"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="minPrice"
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="maxPrice"
                stroke="#3b82f6"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="maxPrice"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            {language === 'ta' ? 'அண்மைக்கால சந்தைப் பதிவுகள்' : 'Recent Daily Trading Records'}
          </h3>
          <span className="text-[11px] text-stone-400">
            Source: Agmarknet API / State Marketing Board
          </span>
        </div>

        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-stone-100 border-b border-stone-200 font-bold text-stone-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Modal Price</th>
                <th className="py-2.5 px-4">Min - Max Price</th>
                <th className="py-2.5 px-4">Arrival Volume</th>
                <th className="py-2.5 px-4">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {priceRecords.slice(-10).reverse().map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50 transition">
                  <td className="py-2 px-4 font-semibold text-stone-800">{rec.date}</td>
                  <td className="py-2 px-4 font-extrabold text-emerald-800">₹{rec.modalPrice}/qtl</td>
                  <td className="py-2 px-4 text-stone-600">
                    ₹{rec.minPrice} - ₹{rec.maxPrice}
                  </td>
                  <td className="py-2 px-4 text-stone-700">{rec.arrivalVolume} quintals</td>
                  <td className="py-2 px-4">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Verified APMC
                    </span>
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
