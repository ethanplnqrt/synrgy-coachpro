/**
 * 🏋️ PROGRAM SERVICE
 * 
 * Minimal stub for program routes
 */

export const programService = {
  async createProgram(data: any) {
    console.log("Creating program:", data);
    return { success: true, data };
  },
  
  async getProgram(id: string) {
    console.log("Getting program:", id);
    return null;
  },
};

