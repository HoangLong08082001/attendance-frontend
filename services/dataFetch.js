const SPREADSHEET_ID = "1maR4xH8w4k4RdM4YFj_TmdfTRmOaeGslAKpYG2wmnHs";
const RANGE = "api_config!A1"; // Dải ô muốn lấy dữ liệu
const API_KEY = "AIzaSyCm1T8Vj7zH3jnwaaEWRrMrEB2VGk4efUI"; // Bạn cần cung cấp API Key cho Google Sheets API
const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

// export async function fetchData() {
//   try {
//     // Gửi yêu cầu GET đến Google Sheets API bằng axiosApiInstance
//     const response = await axiosApiInstance.get(url);

//     const data = response.data.values[0][0]; // Lấy dữ liệu từ response
//     //console.log("data:", data);

//     ARRAY_CONFIG.url_vip_4 = data;
//     //console.log("Updated ARRAY_CONFIG:", ARRAY_CONFIG);

//     axiosApiInstance.defaults.baseURL = ARRAY_CONFIG.url_vip_4;

//     //console.log(
//       "Updated axiosApiInstance baseURL:",
//       axiosApiInstance.defaults.baseURL
//     );
//   } catch (error) {
//     //console.error("Error fetching data: ", error);
//   }
// }

export function hasAttendanceRecord(maNV, day, month, year) {
  const url = `${SUPABASE_URL}/rest/v1/attend?date=eq.${day}&month=eq.${month}&year=eq.${year}&id_staff=eq.${maNV}`;
  const options = {
    method: "get",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    return data.length > 0; // Trả về true nếu có bản ghi
  } catch (error) {
    //console.error("Lỗi khi kiểm tra bản ghi:", error);
    return false;
  }
}
