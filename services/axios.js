import axios from "axios";
import supabase from "./supabaseClient";
import { ARRAY_CONFIG } from "../constants/variable";

const DEFAULT_BASE_URL = "https://human-resource-backend.vercel.app/api"; // BaseURL mặc định

// Hàm lấy baseURL từ Supabase
const fetchBaseURL = async () => {
  try {
    const { data, error } = await supabase
      .from("link_api")
      .select("*")
      .eq("status", true);

    if (error || !data || data.length === 0) {
      return DEFAULT_BASE_URL;
    } else {
    }

    return data[0].url; // URL từ Supabase
  } catch (err) {
    return DEFAULT_BASE_URL;
  }
};

// Tạo axios instance
const axiosApiInstance = axios.create({
  baseURL: DEFAULT_BASE_URL, // BaseURL mặc định
});

// Hàm cập nhật baseURL mỗi lần gọi API
const updateBaseURL = async () => {
  const baseURL = await fetchBaseURL(); // Luôn fetch dữ liệu từ Supabase
  axiosApiInstance.defaults.baseURL = baseURL; // Cập nhật baseURL cho axios instance
  return baseURL;
};

// Cập nhật baseURL ngay khi ứng dụng khởi động
(async () => {
  await updateBaseURL();
})();

export { axiosApiInstance, updateBaseURL };

// import axios from "axios";
// import supabase from "./supabaseClient";
// import { ARRAY_CONFIG } from "../constants/variable";

// const DEFAULT_BASE_URL = "http://192.168.1.188:5000/api"; // BaseURL mặc định

// // Tạo axios instance
// const axiosApiInstance = axios.create({
//   baseURL: ARRAY_CONFIG.url_vip_4, // BaseURL mặc định
// });

// export { axiosApiInstance };
