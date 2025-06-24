import { API_ENDPOINTS } from '../constants/api';

export class JDProjectService {
  static async createProject(fileName) {
    try {
      // Hardcoded auth token
    //   const authToken = '..lY6f7I6dBgbF--Wx4YEUEpe7BLgATVKne7FfkAb9aBUM4oMO2KToTY8ZGyZMckLW2u-QimXEPwtSc5Ys6BT7eJ1Yfl_j6MTJx3WPTvh0XUOMC38Zt8oeXLwpbLputyqki8PPRX1puRTY-A0V9EzlZomMDFdJD7Ux2spPxDWlMolY6DWNbfQakmGwto2ahwcWiAktrF3VR-H27eHzoN1RGjLrOZpyWSYrpkj8Q5pIF3GFVow8rGOSRSXIaQVWJDba8VGIpMFaEgwLXDTWVknON4263gyoxKPTgBqu196w_265KoK0mv6OaZ_XozVsjJpeJR2L1A';
     const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiZjA1MzkxMzk2OTEzYTc4ZWM4MGY0MjcwMzM4NjM2NDA2MTBhZGMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5pa2V0IENoZWxhd2F0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xDaWNZMGdnbTZua0U5ZWRyX3BtTFdxaFczRWRNYTNSN0NmUDUtaVNSVG5uX1R6QT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocS1zb3VyY2luZy1zdGFnIiwiYXVkIjoiaHEtc291cmNpbmctc3RhZyIsImF1dGhfdGltZSI6MTc1MDQwODcwMiwidXNlcl9pZCI6IjY2U1Nyc0dyVUhURlZBVUVhb0tQcGN1YlN6RTMiLCJzdWIiOiI2NlNTcnNHclVIVEZWQVVFYW9LUHBjdWJTekUzIiwiaWF0IjoxNzUwNzUyMjI4LCJleHAiOjE3NTA3NTU4MjgsImVtYWlsIjoiYW5pa2V0LmNoZWxhd2F0QGhpcmVxdW90aWVudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDA0NzY4MDYyMDg1OTYzMTM1MSJdLCJlbWFpbCI6WyJhbmlrZXQuY2hlbGF3YXRAaGlyZXF1b3RpZW50LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.LpiBWEVSGND_LGXTOifr7R8LhMAg2gNKYMEgTJEgQeOTd8Qy7W6GrFSGoT1IQ6QDAARWSR6oOQCWESrbn-MhIFtuclyFmpWcQ5EFMH5FG2x8gMifp3ezb3Ix8rH1gxx6L3dgRLXk8r4L7rfHw4E1TAQAdIL30zrImkg-ANBzUjkp83ecxAWYEam4cKvFAtzAXTUqxsN-yfvVgnhcS1S09azmrVlgD5NEU5M7uU5CCN3Ms2R5kQVHDYosP8Ee7XwVCnbDZp-xtp_sRWN-mYPrSA_yrAItbCVGnnhoWk38Ecs7Qh6icuAzp9b8FZZtwrOG8FchwAi3a33A0oRKRdSxJg"
      // Create form data
      const formData = new FormData();
      formData.append('name', fileName);
      formData.append('purpose', 'IMPORT_CANDIDATES');

      const response = await fetch(API_ENDPOINTS.CREATE_JD_PROJECT, {
        method: 'POST',
        headers: {
          'x-webAuthorization': authToken,
          'appType': 'web',
          'timezone': '-330',
          'sec-ch-ua-platform': '"macOS"',
          'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://easysource-uat.hirequotient.com/'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating JD project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }
} 