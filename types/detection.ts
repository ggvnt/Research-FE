/**
 * Advanced Pineapple Growth Detection & Health Monitoring Types
 * Includes: Growth stages, health issues, nutrient deficiencies, stunted growth
 */

export enum GrowthStage {
    SEEDLING = 'seedling',
    VEGETATIVE = 'vegetative',
    FLOWERING = 'flowering',
    FRUITING = 'fruiting',
    MATURE = 'mature',
}

export enum HealthStatus {
    HEALTHY = 'healthy',
    WARNING = 'warning',
    CRITICAL = 'critical',
}

export enum NutrientDeficiency {
    NITROGEN = 'nitrogen',
    PHOSPHORUS = 'phosphorus',
    POTASSIUM = 'potassium',
    MAGNESIUM = 'magnesium',
    IRON = 'iron',
    ZINC = 'zinc',
    BORON = 'boron',
    NONE = 'none',
}

export interface HealthIssue {
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    affectedArea: number; // percentage
    recommendation: string;
}

export interface StuntedGrowthAnalysis {
    isStunted: boolean;
    severity?: 'mild' | 'moderate' | 'severe';
    estimatedHeightDeficit?: number; // in cm
    potentialCauses: string[];
    recommendations: string[];
}

export interface NutrientAnalysis {
    primaryDeficiency?: NutrientDeficiency;
    secondaryDeficiencies: NutrientDeficiency[];
    symptoms: string[];
    treatments: string[];
    estimatedRecoveryDays: number;
}

export interface DetectionPrediction {
    [key: string]: number;
}

export interface DetectionResult {
    id: string;
    success: boolean;
    growth_stage: GrowthStage;
    confidence: number;
    health_status: HealthStatus;

    // Advanced Analysis
    health_issues: HealthIssue[];
    stunted_growth: StuntedGrowthAnalysis;
    nutrient_analysis: NutrientAnalysis;

    // General
    all_predictions: DetectionPrediction;
    recommendations: string[];
    action_items: string[];

    // Metadata
    timestamp: string;
    imageUri: string;
    imageMetadata?: {
        width: number;
        height: number;
        quality: number;
    };

    // Plant relationship
    plantId?: string;
    daysFromPlanting?: number;

    // Voice alert data
    voiceAlert?: {
        enabled: boolean;
        language: 'en' | 'hi' | 'ta' | 'ml' | 'te';
        message?: string;
    };
}

export interface Plant {
    id: string;
    name: string;
    location: string;
    varietyType?: string;

    // Planting info
    dateAdded: string;
    expectedMaturityDate?: string;

    // Media
    imageUri?: string;
    thumbnailUri?: string;

    // Current status
    currentStage: GrowthStage;
    currentHealthStatus: HealthStatus;
    lastAnalysisDate?: string;

    // Growth tracking
    detectionHistory: DetectionResult[];
    estimatedHeight?: number;
    estimatedDiameter?: number;

    // Notes
    notes: string;
    farmerId?: string;

    // Alerts
    hasActiveAlerts: boolean;
    alertCount: number;
}

export interface GrowthProgress {
    plantId: string;
    plantName: string;
    currentStage: GrowthStage;
    daysInCurrentStage: number;
    projectedMaturityDays: number;
    healthTrendScore: number; // 0-100
    latestHealthStatus: HealthStatus;
    recentAlerts: string[];
}

export interface FarmerAnalytics {
    totalPlants: number;
    activeAlerts: number;
    healthyPlants: number;
    plantsWithIssues: number;
    averageGrowthRate: number;
    totalDetections: number;

    // Stage distribution
    stageDistribution: {
        [key in GrowthStage]: number;
    };

    // Health distribution
    healthDistribution: {
        [key in HealthStatus]: number;
    };

    // Common issues
    commonIssues: { issue: string; count: number }[];
    commonDeficiencies: { deficiency: NutrientDeficiency; count: number }[];

    // Trends
    weeklyDetections: number[];
    averageConfidence: number;
}

export interface VoiceAlertConfig {
    enabled: boolean;
    language: 'en' | 'hi' | 'ta' | 'ml' | 'te'; // English, Hindi, Tamil, Malayalam, Telugu
    criticalOnly: boolean; // Only alert for critical issues
    volume: number; // 0-1
}

export interface FarmingRecommendation {
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    estimatedCost?: number;
    estimatedEffectiveness: number; // 0-1
    timeToImplement: string;
    tags: string[];
    detectionId: string;
}

export type FilterType = 'all' | GrowthStage | HealthStatus;
export type SortType = 'newest' | 'oldest' | 'health_status' | 'growth_stage';
