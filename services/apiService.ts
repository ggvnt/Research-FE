import axios from 'axios';

/**
 * Advanced Pineapple Growth Detection API Service
 * 
 * Features:
 * - Real-time growth stage detection
 * - Health issue identification
 * - Stunted growth monitoring
 * - Nutrient deficiency detection
 * - Voice alert support
 */

// TODO: Update this with your backend server IP address
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 45000,
    headers: {
        Accept: 'application/json',
    },
});

/**
 * Main detection endpoint - analyzes pineapple image for:
 * - Growth stage classification
 * - Health status assessment
 * - Nutrient deficiency detection
 * - Stunted growth analysis
 */
export const detectPineappleGrowth = async (
    imageUri: string,
    plantMetadata?: {
        daysFromPlanting?: number;
        expectedStage?: string;
        location?: string;
    }
): Promise<DetectionResponse> => {
    const formData = new FormData();

    // Add image
    formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `pineapple_${Date.now()}.jpg`,
    } as any);

    // Add metadata if available
    if (plantMetadata) {
        if (plantMetadata.daysFromPlanting) {
            formData.append('days_from_planting', plantMetadata.daysFromPlanting.toString());
        }
        if (plantMetadata.location) {
            formData.append('location', plantMetadata.location);
        }
    }

    try {
        const response = await apiClient.post<DetectionResponse>(
            '/analyze',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            error.response?.data?.detail || 'Detection failed',
            error
        );
    }
};

/**
 * Get health recommendations based on current plant status
 */
export const getHealthRecommendations = async (
    plantId: string,
    detectionId: string
): Promise<RecommendationsResponse> => {
    try {
        const response = await apiClient.get<RecommendationsResponse>(
            `/recommendations/${plantId}/${detectionId}`
        );
        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            'Failed to get recommendations',
            error
        );
    }
};

/**
 * Get growth forecast based on detection history
 */
export const getGrowthForecast = async (
    plantId: string
): Promise<ForecastResponse> => {
    try {
        const response = await apiClient.get<ForecastResponse>(
            `/forecast/${plantId}`
        );
        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            'Failed to get forecast',
            error
        );
    }
};

/**
 * Compare current plant with similar plants in the area
 */
export const compareWithNearbyPlants = async (
    plantId: string,
    location: string,
    growthStage: string
): Promise<ComparisonResponse> => {
    try {
        const response = await apiClient.get<ComparisonResponse>(
            `/compare/${plantId}`,
            {
                params: {
                    location,
                    growth_stage: growthStage,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            'Failed to get comparison',
            error
        );
    }
};

/**
 * Get voice alert generation
 */
export const generateVoiceAlert = async (
    detectionId: string,
    language: 'en' | 'hi' | 'ta' | 'ml' | 'te' = 'en'
): Promise<VoiceAlertResponse> => {
    try {
        const response = await apiClient.post<VoiceAlertResponse>(
            `/voice-alert/${detectionId}`,
            { language }
        );
        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            'Failed to generate voice alert',
            error
        );
    }
};

/**
 * Get batch analysis for multiple plants
 */
export const batchAnalyzeImages = async (
    images: Array<{ uri: string; plantId: string }>
): Promise<BatchAnalysisResponse> => {
    const formData = new FormData();

    images.forEach((img, index) => {
        formData.append(`images`, {
            uri: img.uri,
            type: 'image/jpeg',
            name: `batch_${index}_${Date.now()}.jpg`,
        } as any);
        formData.append(`plant_ids`, img.plantId);
    });

    try {
        const response = await apiClient.post<BatchAnalysisResponse>(
            '/batch-analyze',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new APIError(
            error.response?.status || 500,
            'Batch analysis failed',
            error
        );
    }
};

/**
 * Test server connection
 */
export const testConnection = async (): Promise<boolean> => {
    try {
        const response = await apiClient.get('/health');
        return response.status === 200;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
};

/**
 * Get server version and capabilities
 */
export const getServerInfo = async (): Promise<ServerInfoResponse> => {
    try {
        const response = await apiClient.get<ServerInfoResponse>('/info');
        return response.data;
    } catch (error: any) {
        throw new APIError(500, 'Failed to get server info', error);
    }
};

// ============== Types ==============

interface DetectionResponse {
    success: boolean;
    growth_stage: string;
    confidence: number;
    health_status: string;
    health_issues: any[];
    stunted_growth: any;
    nutrient_analysis: any;
    all_predictions: { [key: string]: number };
    recommendations: string[];
    action_items: string[];
    processing_time_ms: number;
}

interface RecommendationsResponse {
    immediate_actions: string[];
    weekly_actions: string[];
    monthly_actions: string[];
    cost_estimate: number;
    expected_improvement: number;
}

interface ForecastResponse {
    expected_next_stage: string;
    days_to_next_stage: number;
    estimated_maturity_date: string;
    confidence: number;
    risks: string[];
}

interface ComparisonResponse {
    plant_rank: number;
    total_plants_in_area: number;
    health_percentile: number;
    growth_percentile: number;
    better_than: number;
    worse_than: number;
    recommendations: string[];
}

interface VoiceAlertResponse {
    audio_url?: string;
    audio_base64?: string;
    message_text: string;
    language: string;
    duration_seconds: number;
}

interface BatchAnalysisResponse {
    results: DetectionResponse[];
    summary: {
        total_plants: number;
        healthy_plants: number;
        plants_with_issues: number;
        average_confidence: number;
    };
}

interface ServerInfoResponse {
    version: string;
    model_version: string;
    supported_languages: string[];
    features: string[];
    max_image_size_mb: number;
    supported_formats: string[];
}

class APIError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public originalError?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export { APIError };
export default apiClient;
