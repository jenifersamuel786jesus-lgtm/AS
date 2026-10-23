import React, { useState } from 'react';
import {
  User,
  MapPin,
  Trees,
  Droplets,
  Layers,
  Sprout,
  X,
  CheckCircle2,
  BellRing,
  History,
  Edit3,
  Save,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { CROPS, MANDIS } from '../../data/agriData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Editable fields
  const [name, setName] = useState<string>(user.name);
  const [landArea, setLandArea] = useState<number>(user.landArea || 3.0);
  const [district, setDistrict] = useState<string>(user.district || 'Dindigul');
  const [taluk, setTaluk] = useState<string>(user.taluk || 'Oddanchatram');
  const [soilType, setSoilType] = useState<string>(user.soilType || 'Red Sandy Loam');
  const [irrigationType, setIrrigationType] = useState<string>(
    user.irrigationType || 'Borewell & Drip Irrigation'
  );
  const [primaryCrop, setPrimaryCrop] = useState<string>(user.primaryCrop || 'Tomato');
  const [smsAlerts, setSmsAlerts] = useState<boolean>(user.smsAlertsEnabled ?? true);
  const [whatsappAlerts, setWhatsappAlerts] = useState<boolean>(
    user.whatsappAlertsEnabled ?? true
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      nameTa: name,
      landArea,
      district,
      districtTa: district,
      taluk,
      talukTa: taluk,
      soilType,
      soilTypeTa: soilType,
      irrigationType,
      irrigationTypeTa: irrigationType,
      primaryCrop,
      primaryCropTa: primaryCrop,
      smsAlertsEnabled: smsAlerts,
      whatsappAlertsEnabled: whatsappAlerts,
    };
    onUpdateUser(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Outfit']">
                  {language === 'ta' ? user.nameTa : user.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user.clearanceLevel || user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {user.identifier} • {language === 'ta' ? user.districtTa : user.district}
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

        {/* Tab Header */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{language === 'ta' ? 'விவசாய நில விவரங்கள்' : 'Farm Details & Settings'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>
              {language === 'ta'
                ? `ஆலோசனை வரலாறு (${user.advisoryHistory?.length || 0})`
                : `Advisory History (${user.advisoryHistory?.length || 0})`}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {savedSuccess && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? 'விவசாய நில விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!'
                  : 'Farm profile and preferences updated successfully!'}
              </span>
            </div>
          )}

          {activeTab === 'details' ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                  {language === 'ta' ? 'அடிப்படை நில அளவீடுகள்' : 'Agronomic Landholdings'}
                </span>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center space-x-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'திருத்து' : 'Edit Details'}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 transition shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'சேமி' : 'Save Changes'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'விவசாயி பெயர்' : 'Farmer Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold"
                    />
                  ) : (
                    <p className="font-bold text-stone-900 text-sm">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'விளைநில பரப்பளவு' : 'Total Land Area (Acres)'}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.5"
                      value={landArea}
                      onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold"
                    />
                  ) : (
                    <p className="font-bold text-stone-900 text-sm">
                      {user.landArea} {language === 'ta' ? 'ஏக்கர்' : 'Acres'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'மாவட்டம் & வட்டம்' : 'Location (District & Taluk)'}
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-semibold"
                      >
                        {MANDIS.map((m) => (
                          <option key={m.district} value={m.district}>
                            {m.district}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={taluk}
                        onChange={(e) => setTaluk(e.target.value)}
                        placeholder="Taluk"
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-semibold"
                      />
                    </div>
                  ) : (
                    <p className="font-bold text-stone-900 text-sm flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {user.district} ({user.taluk || 'Oddanchatram'}), {user.state}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'முதன்மையான பயிர்' : 'Primary Crop'}
                  </label>
                  {isEditing ? (
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold"
                    >
                      {CROPS.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-bold text-emerald-700 text-sm">
                      {language === 'ta' ? user.primaryCropTa : user.primaryCrop}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'மண் வகை' : 'Soil Profile'}
                  </label>
                  {isEditing ? (
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold"
                    >
                      <option value="Red Sandy Loam">Red Sandy Loam (செம்மண்)</option>
                      <option value="Black Cotton Soil">Black Cotton Soil (கரிசல்)</option>
                      <option value="Clayey Alluvial Soil">Clayey Alluvial (வண்டல்)</option>
                      <option value="Laterite Soil">Laterite Soil (சரளை)</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-stone-800">
                      {language === 'ta' ? user.soilTypeTa || user.soilType : user.soilType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-500 font-semibold mb-1">
                    {language === 'ta' ? 'பாசன முறை' : 'Irrigation Infrastructure'}
                  </label>
                  {isEditing ? (
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold"
                    >
                      <option value="Borewell & Drip Irrigation">Borewell & Drip (சொட்டு நீர்)</option>
                      <option value="Canal Irrigation">Canal Irrigation (கால்வாய்)</option>
                      <option value="Open Well">Open Well (திறந்த கிணறு)</option>
                      <option value="Rainfed">Rainfed (மானாவாரி)</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-stone-800">
                      {language === 'ta'
                        ? user.irrigationTypeTa || user.irrigationType
                        : user.irrigationType}
                    </p>
                  )}
                </div>
              </div>

              {/* Saved Crops & Subscriptions */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
                  {language === 'ta' ? 'அறிவிப்பு மற்றும் எச்சரிக்கை விருப்பங்கள்' : 'Notification Subscriptions'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold text-stone-900">
                        {language === 'ta' ? 'SMS குறுஞ்செய்தி எச்சரிக்கைகள்' : 'Daily SMS Market Spikes'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {language === 'ta' ? 'மண்டி விலை வீழ்ச்சி & உயர்வு' : 'Mandi crash and spike triggers'}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold text-stone-900">
                        {language === 'ta' ? 'வாட்ஸ்அப் வானிலை அறிக்கைகள்' : 'WhatsApp Weekly Forecast'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {language === 'ta' ? 'மழை மற்றும் பூச்சி நோய் எச்சரிக்கை' : 'Rain & pest outbreak alerts'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          ) : (
            /* ADVISORY HISTORY TAB */
            <div className="space-y-3 text-xs">
              <p className="text-stone-500">
                {language === 'ta'
                  ? 'உங்கள் நிலத்திற்காக வழங்கப்பட்ட சமீபத்திய வேளாண் & சந்தை ஆலோசனைகள்:'
                  : 'Chronological record of decision support, pre-sowing recommendations, and risk alerts:'}
              </p>

              {(!user.advisoryHistory || user.advisoryHistory.length === 0) ? (
                <div className="text-center py-8 text-stone-400">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>{language === 'ta' ? 'வரலாற்றுப் பதிவுகள் இல்லை' : 'No advisory history recorded yet.'}</p>
                </div>
              ) : (
                user.advisoryHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.type === 'price_alert'
                              ? 'bg-amber-500'
                              : item.type === 'rescue_plan'
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-bold text-stone-900 text-sm">
                          {language === 'ta' ? item.titleTa : item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed">
                      {language === 'ta' ? item.detailTa : item.detail}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-700">
                        {language === 'ta' ? 'பயிர்:' : 'Target Crop:'} {item.cropName}
                      </span>
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Kisan ID: {user.clearanceLevel || 'TN-AGR-VERIFIED'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold transition"
          >
            {language === 'ta' ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
