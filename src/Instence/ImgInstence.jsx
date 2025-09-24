import axios from "axios";

export const ImgBaseUrl = "http://localhost:8080";

// Country-State-City API Instance

const API_KEY = "RjNobEwxWTR0VFhFWVFzRWpkdWsxMjJDWXEyZmVBaDJmSVpYR1JJTg==";
const BASE_URL = "https://api.countrystatecity.in/v1";

export const CSCInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-CSCAPI-KEY": API_KEY,
  },
});
