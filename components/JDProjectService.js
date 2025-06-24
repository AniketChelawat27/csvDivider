import { API_ENDPOINTS } from "../constants/api";
import { getEnvVar } from "../constants/config";

export class JDProjectService {
  static async createProject(fileName) {
    try {
      // Get auth token from environment/config
      const authToken = getEnvVar('AUTH_TOKEN');

      // Create form data
      const formData = new FormData();
      formData.append("name", fileName);
      formData.append("purpose", "IMPORT_CANDIDATES");

      const response = await fetch(API_ENDPOINTS.CREATE_JD_PROJECT, {
        method: "POST",
        headers: {
          "x-webAuthorization": authToken,
          appType: "web",
          timezone: "-330",
          "sec-ch-ua-platform": '"macOS"',
          "sec-ch-ua":
            '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          Referer: "https://easysource-stag2.hirequotient.com/",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating JD project:", error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }
}
