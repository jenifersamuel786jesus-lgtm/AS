export type Language = 'en' | 'ta';

export type UserRole = 'farmer' | 'fpo' | 'admin';

export interface Crop {
  id: string;
  name: string;
  nameTa: string;
  category: 'Vegetables' | 'Cereals' | 'Cash Crops' | 'Pulses';
  standardUnit: 'quintal' | 'kg';
  minMsp: number; // Minimum Support Price or Benchmark (₹/quintal)
  avgYieldPerAcre: number; // in quintals
  avgCostPerAcre: number; // in ₹
  waterRequirement: 'Low' | 'Medium' | 'High';
  waterRequirementTa: string;
  durationDays: number;
  suitableSoils: string[];
  suitableSeasons: ('Kharif' | 'Rabi' | 'Zaid')[];
  perishability: 'High' | 'Medium' | 'Low';
}

export interface Mandi {
  id: string;
  name: string;
  nameTa: string;
  district: string;
  districtTa: string;
  state: string;
  stateTa: string;
  isApmc: boolean;
  distanceKmFromUser?: number;
  lat: number;
  lng: number;
  avgDailyVolumeQuintals: number;
}

export interface MarketPriceRecord {
  id: string;
  mandiId: string;
  mandiName: string;
  cropId: string;
  cropName: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalVolume: number; // Quintals
  isVerified: boolean;
  source: string;
}

export interface ForecastDay {
  day: number;
  date: string;
  predictedPrice: number;
  lowerBound: number;
  upperBound: number;
  maeTolerance: number;
  expectedTrend: 'up' | 'down' | 'stable';
}

export interface CrashRiskResult {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  crashProbability: number; // 0 to 100%
  expectedPriceDropPct: number;
  confidenceScore: number;
  mainDrivers: {
    factor: string;
    factorTa: string;
    impact: 'positive' | 'negative' | 'neutral';
    detail: string;
    detailTa: string;
  }[];
  recommendedActions: {
    title: string;
    titleTa: string;
    description: string;
    descriptionTa: string;
    urgency: 'low' | 'medium' | 'high';
  }[];
}

export interface PreSowingInput {
  state: string;
  district: string;
  soilType: string;
  irrigation: string;
  landArea: number;
  landUnit: 'acres' | 'hectares' | 'cents';
  season: 'Kharif' | 'Rabi' | 'Zaid';
  budget: number;
  selectedCrops: string[];
}

export interface CropSuitabilityResult {
  cropId: string;
  cropName: string;
  cropNameTa: string;
  suitabilityScore: number; // 0 - 100
  expectedYieldQuintals: number;
  estimatedCultivationCost: number;
  expectedGrossRevenue: number;
  estimatedNetProfit: number;
  roiPct: number;
  breakEvenPrice: number;
  waterNeed: string;
  riskFactor: 'Low' | 'Medium' | 'High';
  dataConfidence: 'High' | 'Medium' | 'Limited';
  caveats: string[];
  caveatsTa: string[];
}

export interface ProfitCalcInput {
  landAreaAcres: number;
  expectedYieldQuintalsPerAcre: number;
  expectedSellingPricePerQuintal: number;
  // Cultivation expenses
  seedsCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  labourCost: number;
  machineryCost: number;
  irrigationCost: number;
  // Post-harvest & Selling expenses
  harvestingPackagingCost: number;
  transportCost: number;
  mandiCommissionCost: number;
  otherCost: number;
}

export interface ProfitCalcResult {
  totalYieldQuintals: number;
  totalCultivationCost: number;
  totalSellingCost: number;
  totalExpenses: number;
  grossRevenue: number;
  netProfit: number;
  costPerQuintal: number;
  breakEvenSellingPrice: number;
  profitMarginPct: number;
  sensitivityMatrix: {
    priceDeltaPct: number;
    sellingPrice: number;
    revenue: number;
    netProfit: number;
  }[];
}

export interface PostHarvestScenarioInput {
  cropId: string;
  harvestQuantityQuintals: number;
  localMandiId: string;
  currentLocalPrice: number;
  selectedAlternateMandiId: string;
  storagePeriodDays: number;
}

export interface PostHarvestOption {
  id: 'immediate' | 'transport' | 'cold_storage';
  title: string;
  titleTa: string;
  badge: string;
  badgeTa: string;
  netReturn: number;
  effectivePricePerQuintal: number;
  grossRevenue: number;
  totalCosts: number;
  costBreakdown: { item: string; itemTa: string; amount: number }[];
  risks: string[];
  risksTa: string[];
  recommendationRating: 'Best Value' | 'Moderate' | 'High Risk';
  requiredVerifications: string[];
  requiredVerificationsTa: string[];
}
