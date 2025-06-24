import { API_ENDPOINTS } from "../constants/api";
import { getEnvVar } from "../constants/config";

export class BulkUploadService {
  static async bulkUploadCandidates(projectId, fileUrl, fileName) {
    try {
      // Get auth token from environment/config
      const authToken = getEnvVar('AUTH_TOKEN');

      // Get cookie from environment/config
      const cookie = getEnvVar('AUTH_COOKIE');
      
      // First, fetch the file content from the URL
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error(
          `Failed to fetch file from URL: ${fileResponse.status}`
        );
      }

      const fileBlob = await fileResponse.blob();

      // Create form data
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("file", fileBlob, fileName);
      formData.append("csvHeaders[Name]", "name");
      formData.append("csvHeaders[Phone]", "phone");
      formData.append("csvHeaders[Location]", "location");
      formData.append("csvHeaders[LinkedIn]", "linkedinprofileurl");
      formData.append("liCookie", "");
      formData.append("detailScrape", "true");
      formData.append("emailScrape", "false");
      formData.append("isSalesNav", "false");
      formData.append("cvSource[label]", "EasySource");
      formData.append("cvSource[value]", "EasySource");

      const response = await fetch(API_ENDPOINTS.BULK_UPLOAD, {
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
          "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
          Connection: "keep-alive",
          Origin: "https://easysource-stag2.hirequotient.com",
          Referer: "https://easysource-stag2.hirequotient.com/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: cookie,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error in bulk upload:", error);
      throw new Error(`Failed to bulk upload candidates: ${error.message}`);
    }
  }
}
