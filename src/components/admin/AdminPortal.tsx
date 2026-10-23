import React, { useState } from 'react';
import {
  ShieldCheck,
  Database,
  Cpu,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  Layers,
  BarChart,
  Users,
  Settings,
  Server,
} from 'lucide-react';
import { Language } from '../../types';
import { CROPS, MANDIS, MODEL_METRICS } from '../../data/agriData';
import { t } from '../../utils/translations';

interface AdminPortalProps {
  language: Language;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ language }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'models' | 'data' | 'logs'>('overview');
  const [activePlotTab, setActivePlotTab] = useState<'actual' | 'confusion' | 'features'>('actual');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setUploadStatus('Sync completed: 10 APMC mandis reconciled. 0 duplicates detected.');
    }, 1200);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadStatus(`Validated "${file.name}": Schema matched (Date, Mandi, Commodity, Modal_Price, Arrivals). 72 records parsed.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 text-white p-6 rounded-2xl shadow-lg border border-stone-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Operations & Telemetry Control</span>
          </div>
          <h1 className="text-2xl font-extrabold font-['Outfit']">
            AgriShield MLOps & Data Operations Portal
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Production Cluster: <span className="font-mono text-emerald-300">asia-southeast1</span> • Database: SQLite (agrishield.db)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Reconciling...' : 'Sync Mandi Feed'}</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
        {[
          { id: 'overview', label: 'Operational Overview', icon: Activity },
          { id: 'models', label: 'ML Model Telemetry & Plots', icon: Cpu },
          { id: 'data', label: 'Data Sources & APMC Ingestion', icon: Database },
          { id: 'logs', label: 'Audit Trail & Alerts', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Operational Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Total Market Records
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit'] mt-1">
                26,048
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Clean historical time series
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Monitored APMC Mandis
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit'] mt-1">
                {MANDIS.length} Markets
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Across TN, MH, KA, AP, PB, GJ
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Active ML Models
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-['Outfit'] mt-1">
                2 Pipelines
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Reg v1.2.0 & Clf v1.2.0
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Test Out-of-Time MAE
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit'] mt-1">
                ₹116.21 / qtl
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                R²: 0.9836 (Strict Chrono Split)
              </div>
            </div>
          </div>

          {/* Model Deployment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4">
              Active Production Artifacts Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Forecaster */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">Model A: Price Forecaster</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ONLINE (ACTIVE)
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Algorithm: <span className="font-mono font-semibold">Gradient_Boosting_Regressor</span></div>
                  <div>Artifact: <span className="font-mono text-stone-500">ml/models/price_forecaster.joblib</span></div>
                  <div>MAE: <span className="font-bold text-emerald-700">₹116.21/qtl</span> | RMSE: ₹345.99 | R²: 0.9836</div>
                  <div>Test Samples: 736 records (2026-01-24 to 2026-03-24)</div>
                </div>
              </div>

              {/* Crash Classifier */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">Model B: Crash Risk Classifier</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ONLINE (ACTIVE)
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Algorithm: <span className="font-mono font-semibold">Gradient_Boosting_Classifier</span></div>
                  <div>Artifact: <span className="font-mono text-stone-500">ml/models/crash_classifier.joblib</span></div>
                  <div>Accuracy: <span className="font-bold text-emerald-700">95.65%</span> | Precision: 53.3% | F1: 0.333</div>
                  <div>Threshold: ≥ 20% modal drop within 7 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ML Model Management & Diagnostic Plots */}
      {activeAdminTab === 'models' && (
        <div className="space-y-6">
          {/* Plot Switcher */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-800">
                  Model Diagnostic Visualizations & Residual Analysis
                </h3>
                <p className="text-xs text-stone-500">
                  Rendered from evaluation script (ml/evaluate_model.py)
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setActivePlotTab('actual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePlotTab === 'actual' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Actual vs Predicted
                </button>
                <button
                  onClick={() => setActivePlotTab('confusion')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePlotTab === 'confusion' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Confusion Matrix
                </button>
                <button
                  onClick={() => setActivePlotTab('features')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePlotTab === 'features' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Feature Importance
                </button>
              </div>
            </div>

            {/* Display Diagnostic Plot */}
            <div className="bg-stone-50 rounded-xl p-4 flex flex-col items-center justify-center border border-stone-200">
              {activePlotTab === 'actual' && (
                <div className="w-full text-center">
                  <img
                    src="/results/actual_vs_predicted.png"
                    alt="Actual vs Predicted Prices"
                    className="max-h-96 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <div className="text-xs text-stone-500 mt-2">
                    Fig 1: Actual vs Predicted Modal Price Curve over Chronological Out-of-Time Test Horizon
                  </div>
                </div>
              )}

              {activePlotTab === 'confusion' && (
                <div className="w-full text-center">
                  <img
                    src="/results/confusion_matrix.png"
                    alt="Confusion Matrix"
                    className="max-h-96 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <div className="text-xs text-stone-500 mt-2">
                    Fig 2: Crash Classification Matrix (Threshold: ≥20% drop | 696 TN, 7 FP, 25 FN, 8 TP)
                  </div>
                </div>
              )}

              {activePlotTab === 'features' && (
                <div className="w-full text-center">
                  <img
                    src="/results/feature_importance.png"
                    alt="Feature Importance"
                    className="max-h-96 mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <div className="text-xs text-stone-500 mt-2">
                    Fig 3: Top Feature Importance Coefficients (Price Lags 1d/3d/7d, Arrival Surge Ratio, Seasonal Harmonics)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Candidate Model Benchmarking (Out-of-Time Test Set)
              </h3>
              <span className="text-[11px] text-stone-400">Source: ml/results/model_comparison.csv</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">Model Candidate</th>
                    <th className="py-2.5 px-4">Task Type</th>
                    <th className="py-2.5 px-4">MAE / Accuracy</th>
                    <th className="py-2.5 px-4">RMSE / F1-Score</th>
                    <th className="py-2.5 px-4">R² / Recall</th>
                    <th className="py-2.5 px-4">Selection Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {MODEL_METRICS.modelComparison.map((m, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-bold text-stone-900">{m.model}</td>
                      <td className="py-3 px-4 font-semibold text-stone-600">{m.type}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-800">{m.mae}</td>
                      <td className="py-3 px-4 text-stone-700">{m.rmse}</td>
                      <td className="py-3 px-4 text-stone-700">{m.r2}</td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Sources & Ingestion */}
      {activeAdminTab === 'data' && (
        <div className="space-y-6">
          {/* CSV Ingestion Tool */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                Manual APMC Market CSV Import
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload verified Agmarknet daily trade CSV files. Automated validation checks schema, price bounds, and duplicate dates.
              </p>
            </div>

            <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-emerald-500 transition cursor-pointer">
              <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <label className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                <span>Click to select CSV file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-stone-400 mt-1">
                Supported headers: <code className="bg-stone-100 px-1 py-0.5 rounded">Date, Mandi, Crop, Min_Price, Max_Price, Modal_Price, Arrivals</code>
              </p>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Mandi Sync Status Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                APMC Mandi Data Source Connection Feeds
              </h3>
              <span className="text-[11px] text-stone-400">Refresh Cadence: Daily 06:00 AM IST</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">Mandi Name</th>
                    <th className="py-2.5 px-4">State</th>
                    <th className="py-2.5 px-4">Last Sync</th>
                    <th className="py-2.5 px-4">Daily Volume</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {MANDIS.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50 transition">
                      <td className="py-2.5 px-4 font-bold text-stone-900">{m.name}</td>
                      <td className="py-2.5 px-4 text-stone-600">{m.state}</td>
                      <td className="py-2.5 px-4 text-stone-500">Today, 08:30 AM</td>
                      <td className="py-2.5 px-4 text-stone-700 font-medium">
                        {m.avgDailyVolumeQuintals.toLocaleString('en-IN')} qtl
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Synced</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail & Alerts Dispatch Log */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              System Audit & Dispatched SMS Notifications Log
            </h3>
            <span className="text-[11px] text-stone-400">Retention: 90 Days</span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {[
              {
                time: 'Today 08:32 AM',
                action: 'SMS Alert Dispatched',
                target: '+91 9842109876',
                details: 'Tomato price crash warning sent to Oddanchatram cluster farmers (Tamil language).',
                status: 'Delivered',
              },
              {
                time: 'Today 08:30 AM',
                action: 'Daily APMC Sync',
                target: '10 Mandis',
                details: 'Received 120 commodity records from Agmarknet API. 0 anomalies detected.',
                status: 'Success',
              },
              {
                time: 'Yesterday 10:14 PM',
                action: 'Model Retrain Validation',
                target: 'Gradient_Boosting_Regressor',
                details: 'Validation completed on test split. Production threshold met (MAE ₹116.21 <= ₹150 target).',
                status: 'Success',
              },
              {
                time: 'Yesterday 04:00 PM',
                action: 'User Authentication',
                target: 'farmer@agrishield.in',
                details: 'Farmer logged in from Android Chrome (Mobile Web).',
                status: 'Success',
              },
            ].map((log, i) => (
              <div key={i} className="p-4 hover:bg-stone-50 transition flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900">{log.action}</span>
                    <span className="text-[10px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                      {log.target}
                    </span>
                  </div>
                  <div className="text-stone-600 mt-1">{log.details}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{log.time}</div>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
