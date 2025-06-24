import { API_ENDPOINTS } from "../constants/api";

export class BulkUploadService {
  static async bulkUploadCandidates(projectId, fileUrl, fileName) {
    try {
      // Hardcoded auth token
      const authToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiZjA1MzkxMzk2OTEzYTc4ZWM4MGY0MjcwMzM4NjM2NDA2MTBhZGMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5pa2V0IENoZWxhd2F0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDaWNZMGdnbTZua0U5ZWRyX3BtTFdxaFczRWRNYTNSN0NmUDUtaVNSVG5uX1R6QT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocS1zb3VyY2luZy1zdGFnIiwiYXVkIjoiaHEtc291cmNpbmctc3RhZyIsImF1dGhfdGltZSI6MTc1MDQwODcwMiwidXNlcl9pZCI6IjY2U1Nyc0dyVUhURlZBVUVhb0tQcGN1YlN6RTMiLCJzdWIiOiI2NlNTcnNHclVIVEZWQVVFYW9LUHBjdWJTekUzIiwiaWF0IjoxNzUwNzYwMTQ4LCJleHAiOjE3NTA3NjM3NDgsImVtYWlsIjoiYW5pa2V0LmNoZWxhd2F0QGhpcmVxdW90aWVudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDA0NzY4MDYyMDg1OTYzMTM1MSJdLCJlbWFpbCI6WyJhbmlrZXQuY2hlbGF3YXRAaGlyZXF1b3RpZW50LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.I4-TwqqJkpM4hBNMXWGw9IuawJR-8HtPlsij50YJtGtPhRZ7cAw5cDeVZBHEKWYvxyQGlIZjflburBil1ChT8KddiResg4J0AJm7NFylomX1GnMp_ywyqTTm33X5H3w9XeZFDFwrbWoTim12l-K8yeMDtjoQ8l5p72QICt3uW6nSdGvdbZAIE-oQ97viOchgY0krb6ByFrcvzLwCMoIXnnpAGhiHElTaeyRRYt7zDNhh5U_6hLHNtMFKODA9fxTvn1cilVmt7Jo52hLpo0BudBnvM1ZizV2le2SNGmslzF0WOvwLn6JKy08OjrDNTHQqlxuE-iJ7ieMzJ5V3O6e87A';

      // Hardcoded cookie
      const cookie = '_hjSessionUser_3710443=eyJpZCI6ImRmM2IzYWNiLTM4YWYtNTAzZi04OWZiLTEzYmMzMmY4MjJhZCIsImNyZWF0ZWQiOjE3NDk1NjQzNDU1MTksImV4aXN0aW5nIjp0cnVlfQ==; intercom-device-id-iwtqqmny=266f22e1-8bb8-4994-b4b3-4801a73e6491; _hjSessionUser_3742621=eyJpZCI6IjNiMDRkNzBiLWE2ZDUtNTExZi1iMjFjLWJmMTIzZDE4MWUyNiIsImNyZWF0ZWQiOjE3NTAwNTc2OTYyNDcsImV4aXN0aW5nIjpmYWxzZX0=; _gcl_au=1.1.235085338.1750057697; _id=1363; uuid=66SSrsGrUHTFVAUEaoKPpcubSzE3; email=aniket.chelawat@hirequotient.com; webAccessToken=eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiZjA1MzkxMzk2OTEzYTc4ZWM4MGY0MjcwMzM4NjM2NDA2MTBhZGMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5pa2V0IENoZWxhd2F0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDaWNZMGdnbTZua0U5ZWRyX3BtTFdxaFczRWRNYTNSN0NmUDUtaVNSVG5uX1R6QT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocS1zb3VyY2luZy1zdGFnIiwiYXVkIjoiaHEtc291cmNpbmctc3RhZyIsImF1dGhfdGltZSI6MTc1MDQwODcwMiwidXNlcl9pZCI6IjY2U1Nyc0dyVUhURlZBVUVhb0tQcGN1YlN6RTMiLCJzdWIiOiI2NlNTcnNHclVIVEZWQVVFYW9LUHBjdWJTekUzIiwiaWF0IjoxNzUwNzU2NzE3LCJleHAiOjE3NTA3NjAzMTcsImVtYWlsIjoiYW5pa2V0LmNoZWxhd2F0QGhpcmVxdW90aWVudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDA0NzY4MDYyMDg1OTYzMTM1MSJdLCJlbWFpbCI6WyJhbmlrZXQuY2hlbGF3YXRAaGlyZXF1b3RpZW50LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.Vf-GmBoMcryf70_3qCUElZ8repFM8t2tPUNQ00xdXGpUjtYrNL2MKtFMUZlhkRmK2gx8SWGTsxI9K5aqWxVqH_g_QDqfbGFvrUf7rpBSJ_aQfcAUk2t9sqJrpq_ZsLe3hKsGwW_4Cqvvrv3WUJ2oxbQSA8uKv6j7opK2UWZGfWrGbI5aHXoa8l0XiadWK_Dazh2k5SWUwTCXz3iaMjsWwOKsLddj732nh2NtNkGBhdbWnembmCNpa7agdGfILrhN98rn49Z8Pg04FinI5yoG7h23Pf1xeuAoneMI4-iae1o3sID_1u3lUB21Y3tApnWEmnAoHMpmOdvEa1YYDz535Q:1750760317000; _hjSession_3710443=eyJpZCI6IjEyM2U4N2FkLTY2ZjgtNDYyOC1hZDg1LTM2NTE1YzAwNTRiNyIsImMiOjE3NTA3NTk1NDgxMTksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; intercom-session-iwtqqmny=MDJDd2VTdytnb0JaYmU0Y29IcmZWSHRPWlNiNFNHSitzcjRaTzVIbWkxRnZHelk5dGcyc29hVS9BOUF2NDZibmVUQkFhaWxra1VMbGtyaGppbmNYRVpCVzIxclVLNTBpa0tPUXVsTDUrRlU9LS16VXBQYUw1ZzNZNC9LV2FWb0x3Skl3PT0=--41f69c24d84238165472875b2258f3f490465da9; WZRK_S_WRZ-58R-K86Z=%22%22';
      
      
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
