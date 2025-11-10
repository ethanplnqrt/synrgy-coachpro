/**
 * 🍎 NUTRITION SERVICE
 * 
 * Minimal stub for nutrition routes
 */

export const nutritionService = {
  async createPlan(data: any) {
    console.log("Creating nutrition plan:", data);
    return { success: true, data };
  },
  
  async getPlan(id: string) {
    console.log("Getting nutrition plan:", id);
    return null;
  },
};

