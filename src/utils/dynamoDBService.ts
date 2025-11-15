/**
 * DynamoDB Service - Utility functions for interacting with DynamoDB via API
 */

const API_BASE_URL = 'http://localhost:5000';

export interface SurveyResult {
  userId: string;
  userName: string;
  email: string;
  timestamp: string;
  completedAt: string;
  responses: Record<string, string | string[]>;
}

/**
 * Save a single survey result directly to DynamoDB
 * Called automatically when a user completes the InitialSurvey
 */
export const saveSurveyToDynamoDB = async (surveyData: SurveyResult): Promise<{ success: boolean; message: string; userId?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save-survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || `Server error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || 'Survey saved successfully',
      userId: result.userId,
    };
  } catch (error) {
    console.error('Error saving survey to DynamoDB:', error);
    const errorMessage = error instanceof TypeError && error.message.includes('Failed to fetch')
      ? 'Cannot connect to API server. Please make sure the Flask server is running.'
      : error instanceof Error 
        ? error.message 
        : 'Failed to save survey to DynamoDB';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

