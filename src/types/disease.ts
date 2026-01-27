export interface DiseaseDetail {
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    cause: string;
    stages: {
        title: string;
        action: string;
        severity: 'low' | 'medium' | 'high';
    }[];
    recommendedIngredients: string[];
}