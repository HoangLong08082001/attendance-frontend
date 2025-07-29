import axios from "axios";
import { ARRAY_CONFIG } from "../constants/variable";
import { axiosApiInstance, updateBaseURL } from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertToMidnightUTC } from "./utils";

// Hàm để thực hiện đăng nhập
export const loginAPI = async (login, password, ip) => {
  try {
    await updateBaseURL();
    // Gửi yêu cầu POST tới endpoint với body chứa login và password
    const response = await axiosApiInstance.post("/auth/login", {
      login,
      password,
      ip,
    });

    // Xử lý phản hồi thành công
    return response;
  } catch (error) {
    // Xử lý lỗi
    return error.response?.data || error.message;
  }
};
export const forgotAPI = async (email) => {
  try {
    await updateBaseURL();
    const response = await axiosApiInstance.post("/auth/forgor-password", {
      email,
    });
    return response;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

// Hàm để thực hiện check-in
export const checkInAPI = async (token, la, long) => {
  try {
    await updateBaseURL();
    let response = await axiosApiInstance.post(
      `/attendance/checkin`,
      { Latitude: la, Longitude: long },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    // Xử lý lỗi
    return error.response?.data;
  }
};

// Hàm để thực hiện check-out
export const checkOutAPI = async (token, la, long) => {
  try {
    await updateBaseURL();
    // Gửi yêu cầu POST tới API checkout, sử dụng token để xác thực
    let response = await axiosApiInstance.post(
      `/attendance/checkout`,
      { Latitude: la, Longitude: long },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    // Xử lý phản hồi thành công
    return response;
  } catch (error) {
    // Xử lý lỗi
    return error.response?.data;
  }
};

export const getAttendanceByUserAPI = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    let response = await axiosApiInstance.post(
      "/attendance/getattendancebyuser",
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    // Gửi yêu cầu GET tới API getattendancebyuser, sử dụng token để xác thực

    // Xử lý phản hồi thành công
    return response.data;
  } catch (error) {
    // Xử lý lỗi

    return error.response?.data || error.message;
  }
};

export const getAttendanceToday = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    const now = new Date();
    // Gửi yêu cầu GET tới API getattendancebyuser, sử dụng token để xác thực
    let [response1, response2] = await Promise.all([
      await axiosApiInstance.post(
        "/attendance/getsettingtime",
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ),
      await axiosApiInstance.post(
        "/attendance/getattendancebyuserdatenow",
        {
          date: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ),
    ]);
    let response = {
      setting_time: response1.data,
      attendance_today: response2.data,
    };

    // Xử lý phản hồi thành công
    return response;
  } catch (error) {
    // Xử lý lỗi
    return error.response?.data || error.message;
  }
};

export const getUserInfoAPI = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    let response = await axiosApiInstance.post(
      "/attendance/getinfouser",
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

// Hàm để thực hiện cập nhật avatar người dùng
export const changeProfileAvatarAPI = async (avatar) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    let response = await axiosApiInstance.post(
      "/attendance/changeprofileavatar", // Update this to the correct endpoint
      { avatar }, // Pass the avatar in the request body
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // Xử lý lỗi
    return error.response?.data || error.message;
  }
};

export const changeProfile = async (name, sologan) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    // //// // //console.log(sologan);

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/changeprofile", // Endpoint của API
      { name, sologan }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api đơn nghỉ phép
export const insertResume1 = async (dateStart, dateEnd, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume1", // Endpoint của API
      { dateStart: dateStart, dateEnd: dateEnd, description: description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn công tác
export const insertResume2 = async (
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }
    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume2", // Endpoint của API
      {
        dateStart: convertToMidnightUTC(dateStart),
        dateEnd: convertToMidnightUTC(dateEnd),
        description,
        starttime,
        endtime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn nghỉ dài hạn
export const insertResume12 = async (dateStart, dateEnd, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume12", // Endpoint của API
      { dateStart: dateStart, dateEnd: dateEnd, description: description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn nghỉ nghỉ việc
export const insertResume13 = async (dateStart, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume13", // Endpoint của API
      { dateStart, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn vắng mặt theo giờ
export const insertResume15 = async (
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume15", // Endpoint của API
      { dateStart, dateEnd, description, starttime, endtime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn nghỉ không dùng phép
export const insertResume16 = async (
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume16", // Endpoint của API
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
        starttime: starttime,
        endtime: endtime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn 17
export const insertResume17 = async (
  dateStart,
  dateEnd,
  description,
  starttime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume17", // Endpoint của API
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
        starttime: starttime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn 18
export const insertResume18 = async (
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume18", // Endpoint của API
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
        starttime: starttime,
        endtime: endtime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn 19
export const insertResume19 = async (
  dateStart,
  dateEnd,
  description,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume19", // Endpoint của API
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
        endtime: endtime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api đơn hiếu hỉ
export const insertResume14 = async (dateStart, dateEnd, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume14", // Endpoint của API
      { dateStart: dateStart, dateEnd: dateEnd, description: description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};
export const insertResume20 = async (dateStart, dateEnd, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/insertresume20", // Endpoint của API
      { dateStart: dateStart, dateEnd: dateEnd, description: description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response || error.message;
  }
};

//api danh sách đơn
export const resumeListForuser = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    // //// // //console.log("token getUserInfo: ",token);

    let response = await axiosApiInstance.get("/attendance/resumelistforuser", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response) {
      return response.data;
    }
  } catch (error) {
    return error.response?.data || error.message;
  }
};

//api danh sách quản lí dơn
export const resumeListForAdmin = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    // //// // //console.log("token admin: ",token);

    let response = await axiosApiInstance.post(
      "/attendance/getresumeallforadmin",
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

//api danh sách nhân viên
export const StaffManage = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    // //// // //console.log("token admin: ",token);

    let response = await axiosApiInstance.post(
      "/attendance/getallinfouserforadmin",
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

//api duyệt đơn
export const approveResumeAdmin = async (resumeId, id_setting_resume) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/approveresumebyadmin", // Endpoint của API
      { resumeId, id_setting_resume }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api xóa đơn
export const removeResume = async (resumeId) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/deleteresume", // Endpoint của API
      { resumeId }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn thôi việc
export const updateResume13 = async (resumeId, dateStart, description) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume13", // Endpoint của API
      { resumeId, dateStart, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};
export const updateResume20 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume20", // Endpoint của API
      {
        resumeId,
        dateStart: convertToMidnightUTC(dateStart),
        dateEnd: convertToMidnightUTC(dateEnd),
        description,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    //// // //console.log(dateStart, dateEnd);

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn nghỉ dài hạn
export const updateResume12 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume12", // Endpoint của API
      { resumeId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn checkout
export const updateResume4 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume4", // Endpoint của API
      { resumeId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn checkin
export const updateResume3 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume3", // Endpoint của API
      { resumeId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn công tác
export const updateResume2 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume2", // Endpoint của API
      {
        resumeId,
        dateStart: convertToMidnightUTC(dateStart),
        dateEnd: convertToMidnightUTC(dateEnd),
        description,
        starttime,
        endtime,
      }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn nghỉ phép
export const updateResume1 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }
    // // // //console.log("api", resumeId,
    //   dateStart,
    //   dateEnd,
    //   description);

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume1", // Endpoint của API
      { resumeId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn chế độ
export const updateResumeOther = async (
  resumeId,
  resumesettingId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/resumeother", // Endpoint của API
      { resumeId, resumesettingId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn vắng mặt theo giờ
export const updateResume15 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume15", // Endpoint của API
      { resumeId, dateStart, dateEnd, description, starttime, endtime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn nghỉ không dùng phép
export const updateResume16 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume16", // Endpoint của API
      { resumeId, dateStart, dateEnd, description, starttime, endtime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn 17
export const updateResume17 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  starttime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume17", // Endpoint của API
      { resumeId, dateStart, dateEnd, description, starttime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn 18
export const updateResume18 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  starttime,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume18", // Endpoint của API
      { resumeId, dateStart, dateEnd, description, starttime, endtime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn 19
export const updateResume19 = async (
  resumeId,
  dateStart,
  dateEnd,
  description,
  endtime
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume19", // Endpoint của API
      { resumeId, dateStart, dateEnd, description, endtime }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

//api sửa đơn hiếu hỉ
export const updateResume14 = async (
  resumeId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresume14", // Endpoint của API
      { resumeId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

export const createCheckinApplication = async (
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/insertresume3",
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response || error.message;
  }
};

export const createCheckoutApplication = async (
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/insertresume4",
      {
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response || error.message;
  }
};

export const getLimitResumeCheckoutIn = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let [response1, response2] = await Promise.all([
      axiosApiInstance.get("/attendance/resume3limit", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      axiosApiInstance.get("/attendance/resume4limit", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    ]);
    return {
      response1: response1?.data?.resume,
      response2: response2?.data?.resume,
    };
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getTypeModeApplication = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.get(
      "/attendance/listresumeotherforuser",
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response || error.message;
  }
};

export const createModeApplication = async (
  resumeId,

  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/insertresumeother",
      {
        resumeId: resumeId,
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    return error.response || error.message;
  }
};

export const getSettingTime = async () => {
  try {
    await updateBaseURL();
    const token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/getsettingtime",
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {}
};
export const cancelResume = async (resumeId) => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let respone = await axiosApiInstance.post(
      "/attendance/cancelresumebyadmin",
      {
        resumeId: resumeId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return respone?.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const changePasswordHandle = async (currentPass, newPass) => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/changepassword",
      {
        currentPassword: currentPass,
        newPassword: newPass,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
//api sửa đơn chế độ
export const HandleUpdateResumeOther = async (
  resumeId,
  resumesettingId,
  dateStart,
  dateEnd,
  description
) => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");

    // Kiểm tra nếu không có token
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    // Gửi yêu cầu POST để cập nhật thông tin người dùng
    let response = await axiosApiInstance.post(
      "/attendance/updateresumeother", // Endpoint của API
      { resumeId, resumesettingId, dateStart, dateEnd, description }, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`, // Thêm token vào header
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

export const getTypeCategoryResume = async () => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.get("/attendance/listresumeforuser", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response) {
      return response?.data;
    }
  } catch (error) {
    // Nếu có lỗi, trả về thông tin lỗi
    return error.response?.data || error.message;
  }
};

export const handleAddNotificaion = async (tokennotification) => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/tokennotification",
      {
        tokennotification: tokennotification,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getListNotification = async () => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.get("/attendance/getnotification", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    // //console.log(error);
    return error;
  }
};
export const seenNotification = async (id) => {
  try {
    await updateBaseURL();
    let token = await AsyncStorage.getItem("userToken");
    let response = await axiosApiInstance.post(
      "/attendance/checknotification",
      { id },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
