import { API_ENDPOINTS } from "../constants/api";

export class JDProjectService {
  static async createProject(fileName) {
    try {
      // Hardcoded auth token
      const authToken =
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiZjA1MzkxMzk2OTEzYTc4ZWM4MGY0MjcwMzM4NjM2NDA2MTBhZGMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5pa2V0IENoZWxhd2F0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDaWNZMGdnbTZua0U5ZWRyX3BtTFdxaFczRWRNYTNSN0NmUDUtaVNSVG5uX1R6QT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocS1zb3VyY2luZy1zdGFnIiwiYXVkIjoiaHEtc291cmNpbmctc3RhZyIsImF1dGhfdGltZSI6MTc1MDQwODcwMiwidXNlcl9pZCI6IjY2U1Nyc0dyVUhURlZBVUVhb0tQcGN1YlN6RTMiLCJzdWIiOiI2NlNTcnNHclVIVEZWQVVFYW9LUHBjdWJTekUzIiwiaWF0IjoxNzUwNzYwMTQ4LCJleHAiOjE3NTA3NjM3NDgsImVtYWlsIjoiYW5pa2V0LmNoZWxhd2F0QGhpcmVxdW90aWVudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDA0NzY4MDYyMDg1OTYzMTM1MSJdLCJlbWFpbCI6WyJhbmlrZXQuY2hlbGF3YXRAaGlyZXF1b3RpZW50LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.I4-TwqqJkpM4hBNMXWGw9IuawJR-8HtPlsij50YJtGtPhRZ7cAw5cDeVZBHEKWYvxyQGlIZjflburBil1ChT8KddiResg4J0AJm7NFylomX1GnMp_ywyqTTm33X5H3w9XeZFDFwrbWoTim12l-K8yeMDtjoQ8l5p72QICt3uW6nSdGvdbZAIE-oQ97viOchgY0krb6ByFrcvzLwCMoIXnnpAGhiHElTaeyRRYt7zDNhh5U_6hLHNtMFKODA9fxTvn1cilVmt7Jo52hLpo0BudBnvM1ZizV2le2SNGmslzF0WOvwLn6JKy08OjrDNTHQqlxuE-iJ7ieMzJ5V3O6e87A";

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
          Referer: "https://easysource-uat.hirequotient.com/",
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
