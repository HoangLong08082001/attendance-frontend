import moment from "moment-timezone";
function formatTimeFromDB(timeString) {
  // Tách chuỗi theo dấu ':'
  const timeParts = timeString.split(":");

  // Trả về phần giờ và phút
  return timeParts[0] + ":" + timeParts[1];
}
const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const day = daysOfWeek[date.getUTCDay()];
  const dateNum = date.getUTCDate();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}, ${dateNum}.${month}.${year}`;
};
const calculateDuration = (
  checkin_time,
  checkout_time,
  checkin_setting,
  checkout_setting
) => {
  // Hàm kiểm tra và chuyển đổi thời gian "hh:mm:ss" thành giây
  const timeToSeconds = (time) => {
    if (typeof time !== "string" || !time.match(/^\d{2}:\d{2}:\d{2}$/)) {
      throw new Error("Thời gian phải là chuỗi định dạng 'hh:mm:ss'");
    }
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  try {
    // Chuyển đổi thời gian thành giây
    let checkinSeconds = timeToSeconds(checkin_time);
    let checkoutSeconds = timeToSeconds(checkout_time);

    // Thời gian giới hạn
    const startLimit = timeToSeconds(checkin_setting);
    const endLimit = timeToSeconds(checkout_setting);

    // Kiểm tra điều kiện đặc biệt
    if (checkinSeconds < startLimit && checkoutSeconds > endLimit) {
      return "8 tiếng"; // Trả về 8 tiếng nếu thỏa điều kiện
    }

    // Nếu checkin_time sau 08:00:00
    if (checkinSeconds >= startLimit) {
      // Nếu checkout_time là 18:00:00 hoặc sau 17:00:00
      if (checkoutSeconds > endLimit) {
        checkoutSeconds = endLimit; // Gán checkout_time về 17:00:00
      }
    }

    // Tính toán khoảng thời gian
    const durationSeconds = checkoutSeconds - checkinSeconds;

    if (durationSeconds < 0) {
      return "Thời gian không hợp lệ"; // Kiểm tra nếu thời gian checkout trước checkin
    }

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);

    // Định dạng lại kết quả với 2 chữ số
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  } catch (error) {
    return error.message; // Trả về thông báo lỗi nếu có
  }
};

const getDayName = () => {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
};
const getCurrentTimeFormatted = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0"); // Định dạng giờ
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Định dạng phút
  const seconds = String(now.getSeconds()).padStart(2, "0"); // Định dạng giây

  return `${hours} giờ ${minutes} phút ${seconds} giây`;
};
const getCurrentTimeCheckInCheckOut = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0"); // Định dạng giờ
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Định dạng phút
  const seconds = String(now.getSeconds()).padStart(2, "0"); // Định dạng giây

  return `${hours}:${minutes}:${seconds}`;
};
const getCalendarByUser = (timestamp) => {
  const date = new Date(timestamp);

  // Lấy các thành phần ngày tháng
  const day = date.getUTCDate(); // Ngày
  return day;
};
const getMonthByUser = (timestamp) => {
  const date = new Date(timestamp);

  // Lấy các thành phần ngày tháng
  const day = date.getUTCMonth(); // Ngày
  return day;
};
const getYearhByUser = (timestamp) => {
  const date = new Date(timestamp);

  // Lấy các thành phần ngày tháng
  const day = date.getUTCFullYear(); // Ngày
  return day;
};

function convertTimeFormat(timeString) {
  if (typeof timeString !== "string") return "--:--"; // Kiểm tra nếu không phải string thì trả về chuỗi rỗng
  const parts = timeString.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : ""; // Đảm bảo có đủ hh và mm
}
function convertTimeString(timeString) {
  // Sử dụng biểu thức chính quy để tách giờ, phút, giây
  const regex = /(\d+)\s*giờ\s*(\d+)\s*phút\s*(\d+)\s*giây/;
  const match = timeString.match(regex);

  if (match) {
    let hours = parseInt(match[1], 10); // Lấy số giờ
    const minutes = parseInt(match[2], 10); // Lấy số phút
    // const seconds = parseInt(match[3], 10); // Giây không cần thiết trong bài toán này

    // Kiểm tra nếu hôm nay là thứ 7
    const today = new Date();
    const isSaturday = today.getDay() === 6; // Thứ 7 có giá trị là 6

    if (isSaturday) {
      // Nếu hôm nay là thứ 7 và thời gian lớn hơn 4 giờ
      if (hours >= 4) {
        return "04:00";
      }

      // Nếu thời gian nhỏ hơn 4 giờ
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }

    // Nếu không phải thứ 7 và giờ lớn hơn hoặc bằng 8
    if (hours >= 8) {
      return "08:00";
    }

    // Định dạng lại kết quả với giờ và phút
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } else {
    return "--:--"; // Nếu chuỗi không đúng định dạng
  }
}

function convertTimeStringHistory(timeString) {
  // Sử dụng biểu thức chính quy để tách giờ, phút, giây
  const regex = /(\d+)\s*giờ\s*(\d+)\s*phút\s*(\d+)\s*giây/;
  const match = timeString.match(regex);

  if (match) {
    const hours = match[1]; // Lấy số giờ
    const minutes = match[2]; // Lấy số phút

    // Định dạng lại kết quả
    return `${hours}:${minutes}`;
  } else {
    return "--:--"; // Nếu chuỗi không đúng định dạng
  }
}
function timeStringToSeconds(timeString) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function subtractTime(time1, time2) {
  const seconds1 = timeStringToSeconds(time1);
  const seconds2 = timeStringToSeconds(time2);

  // Tính toán hiệu
  let diffSeconds = seconds1 - seconds2;

  // Đảm bảo giá trị không âm
  if (diffSeconds < 0) {
    return "Kết quả không hợp lệ"; // Hoặc xử lý theo cách khác nếu cần
  }

  // Chuyển đổi lại thành chuỗi "hh:mm:ss"
  return secondsToTimeString(diffSeconds);
}
const calculateDurationHistory = (
  checkin_time,
  checkout_time,
  created_at,
  checkin_setting,
  checkout_setting
) => {
  // Hàm chuyển đổi thời gian "hh:mm:ss" thành giây
  const timeToSeconds = (time) => {
    if (typeof time !== "string" || !time.match(/^\d{2}:\d{2}:\d{2}$/)) {
      throw new Error("Chưa ghi nhận");
    }
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  try {
    // Kiểm tra nếu checkin_time hoặc checkout_time là null hoặc undefined
    if (checkin_time == null || checkout_time == null) {
      return "Chưa ghi nhận";
    }

    // Kiểm tra nếu created_at là thứ 7
    const createdAtDate = new Date(created_at);
    const isSaturday = createdAtDate.getDay() === 6; // getDay() trả về 6 cho thứ 7

    // Chuyển đổi thời gian checkin và checkout thành giây
    let checkinSeconds = timeToSeconds(checkin_time);
    let checkoutSeconds = timeToSeconds(checkout_time);

    // Thời gian giới hạn (08:00:00 - 17:00:00)
    const startLimit = timeToSeconds(checkin_setting);
    const endLimit = timeToSeconds(checkout_setting);

    // Kiểm tra điều kiện đặc biệt: Nếu checkin trước 08:00 và checkout sau 17:00
    if (checkinSeconds < startLimit && checkoutSeconds > endLimit) {
      return "Cả ngày - 8 tiếng"; // Trả về 8 tiếng nếu thỏa điều kiện
    }

    // Nếu checkin_time sau 08:00:00 và checkout_time sau 17:00:00
    if (checkinSeconds >= startLimit) {
      if (checkoutSeconds > endLimit) {
        checkoutSeconds = endLimit; // Giới hạn checkout về 17:00:00
      }
    }

    // Tính toán khoảng thời gian làm việc (thời gian checkout - checkin)
    let durationSeconds = checkoutSeconds - checkinSeconds;

    if (durationSeconds < 0) {
      return "Thời gian không hợp lệ"; // Kiểm tra nếu checkout trước checkin
    }

    // Trừ đi 1 giờ (3600 giây) nếu không phải thứ 7
    if (!isSaturday) {
      durationSeconds -= 3600; // Trừ đi 1 giờ
    }

    // Kiểm tra nếu thời gian làm việc đủ 8 tiếng (28800 giây)
    if (durationSeconds >= 28800) {
      return "Cả ngày - 8 tiếng"; // Nếu đủ hoặc quá 8 tiếng
    }

    // Tính toán giờ và phút từ tổng số giây còn lại
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);

    if (hours && minutes) {
      return `Nửa ngày - ${String(hours).padStart(2, "0")} tiếng`;
    }
    if (hours) {
      return `Nửa ngày - ${String(hours).padStart(2, "0")} tiếng`;
    }
    if (minutes) {
      return `Nửa ngày - ${String(minutes).padStart(2, "0")} phút`;
    }
  } catch (error) {
    return error.message; // Trả về thông báo lỗi nếu có
  }
};

const addHoursToTimeString = (timeString, hoursToAdd) => {
  // Tách các thành phần giờ, phút, giây
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Cộng thêm giờ
  const totalHours = hours + hoursToAdd;

  // Tính giá trị giờ mới (0-23)
  const newHours = totalHours % 24;
  const newMinutes = minutes % 60; // Giá trị phút không thay đổi trong trường hợp này
  const newSeconds = seconds % 60; // Giá trị giây không thay đổi trong trường hợp này

  // Định dạng lại kết quả
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(
    2,
    "0"
  )}:${String(newSeconds).padStart(2, "0")}`;
};
const isCurrentTimeAfterOneHour = (timeString) => {
  // Lấy thời gian hiện tại
  const now = new Date();

  // Tách chuỗi thời gian thành giờ, phút, giây
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Tạo đối tượng Date từ thời gian đã cho
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    seconds
  );

  // Cộng thêm 1 giờ vào thời gian mục tiêu
  targetTime.setHours(targetTime.getHours() + 1);

  // So sánh thời gian hiện tại với thời gian đã điều chỉnh
  return now > targetTime;
};
const formatDateStringBirth = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const day = daysOfWeek[date.getUTCDay()];
  const dateNum = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${dateNum}/${month}/${year}`;
};
function calculateWorkingTime(checkinTime, checkoutTime) {
  // Chuyển đổi thời gian từ định dạng "HH:mm:ss" thành tổng số giây
  const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // Chuyển đổi thời gian checkin và checkout thành giây
  const checkinSeconds = convertToSeconds(checkinTime);
  const checkoutSeconds = convertToSeconds(checkoutTime);

  // Tính toán tổng số giây làm việc
  let totalSeconds = checkoutSeconds - checkinSeconds;

  // Trừ đi 1 giờ (3600 giây)
  totalSeconds -= 3600;

  // Nếu thời gian làm việc sau khi trừ đi 1 giờ nhỏ hơn 0, đặt lại thành 0 giây
  if (totalSeconds < 0) {
    totalSeconds = 0;
  }

  // Giới hạn thời gian làm việc tối đa là 8 giờ (28800 giây)
  const maxWorkingSeconds = 8 * 3600;
  if (totalSeconds > maxWorkingSeconds) {
    totalSeconds = maxWorkingSeconds;
  }

  // Tính giờ, phút, giây từ tổng số giây
  const hours = Math.floor(totalSeconds / 3600); // Tính giờ
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Tính phút

  // Trả về kết quả dưới dạng chuỗi "HH:mm"
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
function calculateWorkingTimeSaturday(checkinTime, checkoutTime) {
  // Chuyển đổi thời gian từ định dạng "HH:mm:ss" thành tổng số giây
  const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // Chuyển đổi thời gian checkin và checkout thành giây
  const checkinSeconds = convertToSeconds(checkinTime);
  const checkoutSeconds = convertToSeconds(checkoutTime);

  // Tính toán tổng số giây làm việc
  let totalSeconds = checkoutSeconds - checkinSeconds;

  // Nếu thời gian làm việc nhỏ hơn 0, đặt lại thành 0 giây
  if (totalSeconds < 0) {
    totalSeconds = 0;
  }

  // Giới hạn thời gian làm việc tối đa là 4 giờ (14400 giây)
  const maxAllowedSeconds = 4 * 3600; // 4 giờ = 14400 giây
  if (totalSeconds > maxAllowedSeconds) {
    totalSeconds = maxAllowedSeconds;
  }

  // Tính giờ và phút từ tổng số giây
  const hours = Math.floor(totalSeconds / 3600); // Tính giờ
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Tính phút

  // Trả về kết quả dưới dạng chuỗi "HH:mm"
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
function isDateBeforeOrEqualToday(dateString) {
  // Chuyển chuỗi ngày thành đối tượng Date (mặc định theo múi giờ địa phương)
  const inputDate = new Date(dateString);

  // Lấy ngày hiện tại và chuyển đổi nó thành UTC (00:00:00 ngày hôm nay theo giờ UTC)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Đặt thời gian của ngày hôm nay là 00:00:00 theo giờ UTC

  // So sánh ngày, chỉ so sánh phần ngày (không so sánh giờ, phút, giây)
  return inputDate.setUTCHours(0, 0, 0, 0) <= today.getTime();
}
function timeDifferenceFromEightAM(timeString, checkin_setting) {
  const [hoursCheckin, minutesCheckin, secondsCheckin = 0] = checkin_setting
    .split(":")
    .map(Number);
  // Tạo đối tượng Date cho 8:00 sáng (Ngày mặc định là ngày hiện tại)
  const eightAM = new Date();
  eightAM.setHours(hoursCheckin, minutesCheckin, secondsCheckin, 0); // Đặt giờ là 8:00 sáng, phút: 0, giây: 0

  // Chuyển thời gian truyền vào thành đối tượng Date
  const inputTime = new Date();
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  inputTime.setHours(hours, minutes, seconds, 0); // Đặt giờ, phút, giây từ timeString

  // Tính sự chênh lệch thời gian (tính bằng mili giây)
  const diffMs = inputTime - eightAM; // Chênh lệch thời gian theo mili giây

  // Nếu đến đúng 8:00:00
  if (diffMs === 0) {
    return "Đến đúng giờ";
  }

  // Nếu thời gian nhập vào sớm hơn 8:00 (diffMs < 0)
  if (diffMs < 0) {
    const diffAbsMs = Math.abs(diffMs); // Lấy giá trị tuyệt đối của sự chênh lệch thời gian

    // Chuyển đổi sự chênh lệch thành giờ, phút, giây
    const diffHours = Math.floor(diffAbsMs / (1000 * 60 * 60)); // Tính số giờ
    const diffMinutes = Math.floor(
      (diffAbsMs % (1000 * 60 * 60)) / (1000 * 60)
    ); // Tính số phút
    const diffSeconds = Math.floor((diffAbsMs % (1000 * 60)) / 1000); // Tính số giây

    // Trả về kết quả đến sớm
    if (diffHours > 0) {
      return `Đến sớm ${diffHours} giờ `;
    } else if (diffMinutes > 0) {
      return `Đến sớm ${diffMinutes} phút`;
    } else {
      return `Đến sớm ${diffSeconds} giây`;
    }
  }

  // Nếu thời gian nhập vào muộn hơn 8:00 (diffMs > 0)
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Tính số giờ
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Tính số phút
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Tính số giây

  // Trả về kết quả trễ
  if (diffHours > 0) {
    return `Trễ ${diffHours} giờ`;
  } else if (diffMinutes > 0) {
    return `Trễ ${diffMinutes} phút`;
  } else {
    return `Trễ ${diffSeconds} giây`;
  }
}

function timeDifferenceToFivePM(dateString, timeString, checkout_setting) {
  // Kiểm tra đầu vào
  if (!dateString || !timeString) {
    //console.error("dateString hoặc timeString không hợp lệ");
    return { message: "Dữ liệu không hợp lệ", status: false };
  }

  // Tạo đối tượng Date từ dateString
  const inputDate = new Date(dateString);
  if (isNaN(inputDate.getTime())) {
    //console.error("Ngày không hợp lệ");
    return { message: "Ngày không hợp lệ", status: false };
  }

  // Kiểm tra nếu ngày là thứ 7
  const isSaturday = inputDate.getDay() === 6;

  // Tạo đối tượng thời gian từ timeString
  const [hours, minutes, seconds] = timeString
    .toString()
    .split(":")
    .map((x) => parseInt(x, 10) || 0);

  if (isSaturday) {
    // Logic nếu là thứ 7
    if (hours >= 12) {
      return { message: "Về đúng giờ", status: true };
    } else {
      const hoursDiff = 12 - hours - 1; // Số giờ sớm
      const minutesDiff = 60 - minutes; // Số phút sớm
      const secondsDiff = 60 - seconds; // Số giây sớm
      return {
        message: `Sớm ${hoursDiff} giờ ${minutesDiff} phút ${secondsDiff} giây`,
        status: false,
      };
    }
  } else {
    // Logic nếu không phải thứ 7
    const fivePM = new Date(dateString);
    const [hoursCheckout, minutesCheckout, secondsCheckout = 0] =
      checkout_setting.split(":").map(Number);
    fivePM.setHours(hoursCheckout, minutesCheckout, secondsCheckout, 0); // Thiết lập thời gian 17:00:00
    const inputTime = new Date(dateString);
    inputTime.setHours(hours, minutes, seconds, 0); // Thiết lập thời gian từ timeString

    if (inputTime >= fivePM) {
      return { message: "Về đúng giờ", status: true };
    } else {
      // Tính sự chênh lệch thời gian
      const diffMs = fivePM - inputTime; // Chênh lệch thời gian tính bằng milliseconds
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      // Trả về thông báo phù hợp
      if (diffHours || diffMinutes || diffSeconds) {
        return {
          message: `Về sớm ${diffHours} tiếng ${diffMinutes} phút ${diffSeconds} giây`,
          status: false,
        };
      }
    }
  }

  // Trường hợp không rơi vào điều kiện nào
  return { message: "Không thể xác định", status: false };
}

function isSunday(dateString) {
  // Chuyển chuỗi "year-month-day" thành đối tượng Date
  const date = new Date(dateString);

  // Kiểm tra nếu ngày là Chủ nhật (0 là Chủ nhật)
  return date.getDay() === 0;
}
function isDateBeforeOrEqualToday1(dateString) {
  // Chuyển chuỗi ngày thành đối tượng Date (mặc định theo múi giờ địa phương)
  const inputDate = new Date(dateString);

  // Lấy ngày hiện tại
  const today = new Date();

  // Lấy ngày, tháng, và năm của ngày hôm nay
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // getMonth() trả về từ 0 đến 11
  const currentYear = today.getFullYear();

  // Lấy ngày, tháng, và năm của ngày nhập vào
  const inputDay = inputDate.getDate();
  const inputMonth = inputDate.getMonth();
  const inputYear = inputDate.getFullYear();

  // Nếu năm của ngày nhập vào nhỏ hơn năm hiện tại hoặc năm bằng nhưng tháng nhỏ hơn tháng hiện tại
  if (
    inputYear > currentYear ||
    (inputYear === currentYear && inputMonth > currentMonth) ||
    (inputYear === currentYear &&
      inputMonth === currentMonth &&
      inputDay > currentDay)
  ) {
    return false; // Ngày nhập vào thuộc tương lai (sau ngày hôm nay)
  }

  // Nếu không rơi vào trường hợp trên, tức là ngày nhập vào trước hoặc bằng ngày hôm nay
  return true;
}
function convertDateFormat(inputDate) {
  // Tạo đối tượng Date từ chuỗi đầu vào
  const date = new Date(inputDate);

  // Lấy ngày, tháng, và năm từ đối tượng Date
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  // Trả về chuỗi theo định dạng MM/dd/yyyy
  return `${day}/${month}/${year}`;
}

const splitNumberFormTime = (timeStr) => {
  const hours = parseInt(timeStr.split(":")[0]);
  return hours;
};
function formatDateToVN(createdAt) {
  // Tạo một đối tượng Date từ createdAt
  const date = new Date(createdAt);

  // Mảng các tên ngày trong tuần (tiếng Việt)
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  // Mảng các tên tháng trong năm (tiếng Việt)
  const monthsOfYear = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  // Lấy thông tin ngày, tháng, năm và ngày trong tuần
  const dayOfWeek = daysOfWeek[date.getDay()]; // Lấy ngày trong tuần
  const day = date.getDate(); // Lấy ngày trong tháng
  const month = monthsOfYear[date.getMonth()]; // Lấy tháng (0-11)
  const year = date.getFullYear(); // Lấy năm

  // Trả về định dạng "Thứ, ngày tháng năm"
  return `${dayOfWeek}, ${day}/${month}/${year}`;
}

function getWeekNumber(date) {
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  // Tính ngày thứ 2 trong tuần hiện tại (bắt đầu từ thứ 2)
  const startOfWeek = new Date(localDate);
  startOfWeek.setDate(
    localDate.getDate() -
      (localDate.getDay() === 0 ? 6 : localDate.getDay() - 1)
  ); // Thứ 2 của tuần này

  // Tính ngày đầu tiên của năm (January 1st)
  const startOfYear = new Date(localDate.getFullYear(), 0, 1);

  // Tính số ngày giữa startOfYear và startOfWeek
  const daysBetween = Math.floor(
    (startOfWeek - startOfYear) / (24 * 60 * 60 * 1000)
  );

  // Tính số tuần
  const weekNumber = Math.floor(daysBetween / 7) + 1;

  return weekNumber;
}
function groupByWeek(data) {
  const weeks = {}; // Để lưu trữ mảng theo tuần

  data.forEach((item) => {
    const date = new Date(item.year, item.month - 1, item.date); // Tạo đối tượng Date từ year, month, date
    const weekNumber = getWeekNumber(date); // Tính số tuần của ngày này

    // Nếu chưa có tuần này trong đối tượng weeks, khởi tạo mảng
    if (!weeks[weekNumber]) {
      weeks[weekNumber] = [];
    }

    // Thêm item vào mảng tuần tương ứng
    weeks[weekNumber].push(item);
  });

  // Chuyển đổi object thành array để dùng trong ScrollView
  return Object.keys(weeks).map((weekNumber) => ({
    title: `Week ${weekNumber}`,
    data: weeks[weekNumber],
  }));
}
function formatDate(dateString) {
  // Tách chuỗi thành ngày, tháng và năm
  const [day, month, year] = dateString.split("-").map((num) => parseInt(num));

  // Tạo đối tượng Date từ ngày, tháng, năm
  const date = new Date(year, month - 1, day); // Month trong JavaScript bắt đầu từ 0 (0-11)

  // Mảng các tên ngày trong tuần bằng tiếng Việt
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  // Lấy tên ngày trong tuần
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Định dạng ngày thành "thứ, ngày.tháng.năm"
  const formattedDate = `${dayOfWeek}, ${day}.${
    month < 10 ? "0" + month : month
  }.${year}`;

  return formattedDate;
}
function isTime1LessThanTime2(time1, time2) {
  // Hàm chuyển đổi giờ phút (hh:mm) hoặc giờ phút giây (hh:mm:ss) thành số giây từ đầu ngày
  const convertToSeconds = (time) => {
    const timeParts = time.split(":"); // Chia chuỗi theo dấu ":"
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10);
    let seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0; // Nếu có giây thì lấy, nếu không thì mặc định là 0
    return hours * 3600 + minutes * 60 + seconds; // Chuyển thành tổng số giây
  };

  // Chuyển đổi cả hai chuỗi thời gian thành giây
  const time1InSeconds = convertToSeconds(time1);
  const time2InSeconds = convertToSeconds(time2);

  // Kiểm tra xem thời gian 1 có nhỏ hơn thời gian 2 không
  return time1InSeconds < time2InSeconds;
}
function isBeforeEight(timeString, checkin_setting) {
  // Tạo đối tượng moment từ chuỗi thời gian đầu vào (định dạng hh:mm:ss)
  const inputTime = moment.tz(timeString, "HH:mm:ss", "Asia/Ho_Chi_Minh");
  // Tạo đối tượng moment cho thời gian 08:00:00
  const eightAM = moment.tz(checkin_setting, "HH:mm:ss", "Asia/Ho_Chi_Minh");

  // So sánh inputTime với eightAM
  return inputTime.isSameOrBefore(eightAM);
}
function isBeforeFive(timeString, checkout_setting) {
  // Tạo đối tượng moment từ chuỗi thời gian đầu vào (định dạng hh:mm:ss)
  const inputTime = moment.tz(timeString, "HH:mm:ss", "Asia/Ho_Chi_Minh");
  // Tạo đối tượng moment cho thời gian 08:00:00
  const eightAM = moment.tz(checkout_setting, "HH:mm:ss", "Asia/Ho_Chi_Minh");

  // So sánh inputTime với eightAM
  return inputTime.isSameOrAfter(eightAM);
}
function isAfterFive(timeString, checkout_setting) {
  // Tạo đối tượng moment từ chuỗi thời gian đầu vào (định dạng hh:mm:ss)
  const inputTime = moment.tz(timeString, "HH:mm:ss", "Asia/Ho_Chi_Minh");
  // Tạo đối tượng moment cho thời gian 08:00:00
  const eightAM = moment.tz(checkout_setting, "HH:mm:ss", "Asia/Ho_Chi_Minh");

  // So sánh inputTime với eightAM
  return inputTime.isSameOrBefore(eightAM);
}
const getAttendanceByWeek = (data, startDate) => {
  const startOfWeek = moment(startDate).startOf("isoWeek"); // Thứ Hai của tuần
  const endOfWeek = startOfWeek.clone().endOf("isoWeek"); // Chủ Nhật của tuần

  return data.filter((item) => {
    const createdAt = moment(item.created_at);
    return createdAt.isBetween(startOfWeek, endOfWeek, "day", "[]"); // Lọc các mục nằm trong tuần
  });
};
function subtractTimeNew(time1, time2) {
  // Hàm chuyển đổi thời gian từ định dạng 'hh:mm:ss' hoặc 'hh:mm' thành số phút
  function timeToMinutes(time) {
    let parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    // Chuyển thành phút (giờ * 60 + phút + giây/60)
    return hours * 60 + minutes + seconds / 60;
  }

  // Chuyển hai chuỗi thời gian thành số phút
  let time1Min = timeToMinutes(time1);
  let time2Min = timeToMinutes(time2);

  // Trừ thời gian (tính bằng phút)
  let diffMin = time1Min - time2Min;

  // Trừ đi 1 tiếng (60 phút)
  diffMin -= 60;

  // Đảm bảo không có giá trị âm (giới hạn nếu kết quả âm)
  if (diffMin < 0) {
    diffMin = 0;
  }

  // Giới hạn không vượt quá 8 giờ = 8 * 60 = 480 phút
  const MAX_TIME_MIN = 480;
  if (diffMin > MAX_TIME_MIN) {
    diffMin = MAX_TIME_MIN;
  }

  // Chuyển lại kết quả về định dạng 'hh:mm'
  function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  // Trả về kết quả
  return minutesToTime(diffMin);
}
function subtractTimeNewSaturday(time1, time2) {
  // Hàm chuyển đổi thời gian từ định dạng 'hh:mm:ss' hoặc 'hh:mm' thành số phút
  function timeToMinutes(time) {
    let parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    // Chuyển thành phút (giờ * 60 + phút + giây/60)
    return hours * 60 + minutes + seconds / 60;
  }

  // Chuyển hai chuỗi thời gian thành số phút
  let time1Min = timeToMinutes(time1);
  let time2Min = timeToMinutes(time2);

  // Trừ thời gian (tính bằng phút)
  let diffMin = time1Min - time2Min;

  // Đảm bảo không có giá trị âm (giới hạn nếu kết quả âm)
  if (diffMin < 0) {
    diffMin = 0;
  }

  // Giới hạn không vượt quá 4 giờ = 4 * 60 = 240 phút
  const MAX_TIME_MIN = 240; // Giới hạn 4 giờ
  if (diffMin > MAX_TIME_MIN) {
    diffMin = MAX_TIME_MIN;
  }

  // Chuyển lại kết quả về định dạng 'hh:mm'
  function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  // Trả về kết quả
  return minutesToTime(diffMin);
}

function isDateMoreThanOneMonthAgoAndTodayIs10(dateString) {
  // Chuyển chuỗi ngày thành đối tượng Date
  const inputDate = new Date(dateString);

  // Lấy ngày hiện tại
  const today = new Date();

  // Lấy ngày, tháng, và năm của ngày hôm nay
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // getMonth() trả về từ 0 đến 11
  const currentYear = today.getFullYear();

  // Lấy ngày, tháng, và năm của ngày nhập vào
  const inputDay = inputDate.getDate();
  const inputMonth = inputDate.getMonth();
  const inputYear = inputDate.getFullYear();

  // Kiểm tra xem ngày nhập vào có cách hiện tại hơn 1 tháng về trước không
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1); // Lùi 1 tháng từ ngày hiện tại

  // Nếu ngày nhập vào trước hơn 1 tháng so với ngày hiện tại, trả về false
  if (inputDate < oneMonthAgo) {
    // Kiểm tra xem hôm nay có phải là ngày 10 của tháng không
    if (currentDay === 10) {
      return false; // Nếu hôm nay là ngày 10 và ngày nhập vào hơn 1 tháng trước thì trả về false
    }
  }

  // Nếu không thỏa mãn điều kiện trên, trả về true
  return true;
}

function isDateInRange(selectedDate, start, end) {
  // Chuyển đổi các ngày sang Moment objects
  const selected = moment(selectedDate, "YYYY-MM-DD");
  const startDate = moment(start, "YYYY-MM-DD");
  const endDate = moment(end, "YYYY-MM-DD");

  // Kiểm tra ngày có nằm trong khoảng hay không
  return selected.isBetween(startDate, endDate, "day", "[]"); // '[]' để bao gồm cả ngày đầu và cuối
}
function subtractTimeResume(time1, time2) {
  // Hàm chuyển đổi thời gian từ định dạng 'hh:m:ss' hoặc 'hh:mm' thành số phút
  function timeToMinutes(time) {
    let parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    // Chuyển thành phút (giờ * 60 + phút + giây/60)
    return hours * 60 + minutes + seconds / 60;
  }

  // Chuyển hai chuỗi thời gian thành số phút
  let time1Min = timeToMinutes(time1);
  let time2Min = timeToMinutes(time2);

  // Trừ thời gian (tính bằng phút)
  let diffMin = time1Min - time2Min;

  // Giới hạn không vượt quá 8 giờ = 8 * 60 = 480 phút
  const MAX_TIME_MIN = 480;
  if (diffMin > MAX_TIME_MIN) {
    diffMin = MAX_TIME_MIN;
  }

  // Chuyển lại kết quả về định dạng 'hh:mm'
  function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = Math.round(minutes % 60);
    if (hours > 0 && mins > 0) {
      return `${hours} tiếng ${mins} phút`;
    }

    // Nếu chỉ có tiếng
    if (hours > 0) {
      return `${hours} tiếng`;
    }

    // Nếu chỉ có phút
    if (mins > 0) {
      return `${mins} phút`;
    }

    // Nếu không có tiếng và phút (không thể xảy ra trong tình huống này, nhưng có thể bổ sung bảo vệ)
    return "0 phút";
  }

  // Trả về kết quả
  return minutesToTime(diffMin);
}

function checkTimes(time1, time2, checkin_setting, checkout_setting) {
  // Kiểm tra nếu một trong hai thời gian là rỗng
  if (!time1 || !time2) {
    return true;
  }

  // Chuyển đổi thời gian thành đối tượng moment
  const time1Moment = moment(time1, "HH:mm:ss");
  const time2Moment = moment(time2, "HH:mm:ss");

  // Thời gian chuẩn (8:00:00 và 17:00:00)
  const eightAM = moment(checkin_setting, "HH:mm:ss");
  const fivePM = moment(checkout_setting, "HH:mm:ss");

  // Điều kiện 1: Nếu `time1` trước 8 giờ và `time2` sau 17 giờ thì trả về false
  if (time1Moment.isBefore(eightAM) && time2Moment.isAfter(fivePM)) {
    return false;
  }

  // Điều kiện 2: Nếu cả hai thời gian đều rỗng
  if (!time1 && !time2) {
    return true;
  }

  // Điều kiện 3: Nếu `time1` sau 8 giờ và `time2` sau 17 giờ thì trả về true
  if (time1Moment.isAfter(eightAM) && time2Moment.isAfter(fivePM)) {
    return true;
  }

  // Điều kiện 4: Nếu `time1` trước 8 giờ và `time2` trước 17 giờ thì trả về true
  if (time1Moment.isBefore(eightAM) && time2Moment.isBefore(fivePM)) {
    return true;
  }

  // Điều kiện 5: Nếu `time1` sau 8 giờ và `time2` trước hoặc bằng 17 giờ thì trả về true
  if (time1Moment.isAfter(eightAM) && time2Moment.isBefore(fivePM)) {
    return true;
  }

  // Điều kiện 6: Nếu `time1` trước 8 giờ nhưng `time2` trước 17 giờ thì trả về true
  if (time1Moment.isBefore(eightAM) && time2Moment.isBefore(fivePM)) {
    return true;
  }

  // Nếu không thuộc các điều kiện trên thì trả về false
  return false;
}
function isTimeBetween8And5(timeString, checkin_setting, checkout_setting) {
  function addMinuteToTime2(time) {
    // Kiểm tra và chuẩn hóa thời gian, nếu có phần giây thì bỏ đi
    const [hours, minutes, seconds] = time.split(":").map(Number);

    // Tạo đối tượng Date với thời gian ban đầu
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0); // Nếu không có giây, gán 0 cho giây

    // Cộng thêm 1 phút
    date.setMinutes(date.getMinutes() + 1);

    // Trả về kết quả sau khi cộng 1 phút, ở định dạng "HH:MM" hoặc "HH:MM:SS"
    const updatedHours = String(date.getHours()).padStart(2, "0");
    const updatedMinutes = String(date.getMinutes()).padStart(2, "0");
    const updatedSeconds = String(date.getSeconds()).padStart(2, "0");

    // Nếu thời gian ban đầu không có giây, chỉ trả về "HH:MM"
    if (seconds === undefined) {
      return `${updatedHours}:${updatedMinutes}`;
    }

    return `${updatedHours}:${updatedMinutes}:${updatedSeconds}`;
  }
  // Đảm bảo rằng chuỗi timeString có định dạng đúng "hh:mm:ss" hoặc "hh:mm"
  const time = moment(timeString, ["HH:mm:ss", "HH:mm"], true);

  // Kiểm tra xem chuỗi có hợp lệ không
  if (!time.isValid()) {
    return false;
  }

  // Thời gian bắt đầu là 08:00:01 (tức là sau 8 giờ)
  const startTime = moment(addMinuteToTime2(checkin_setting), "HH:mm:ss");
  // Thời gian kết thúc là 17:00:00
  const endTime = moment(checkout_setting, "HH:mm:ss");

  // Kiểm tra nếu thời gian nằm trong khoảng từ 08:00:01 đến 17:00:00
  return time.isAfter(startTime) && time.isBefore(endTime);
}
function isWithinWorkingHours(inputTime, checkout_setting) {
  // Chuẩn hóa thời gian đầu vào với định dạng có thể là "HH:mm:ss" hoặc "HH:mm"
  const timeFormat =
    inputTime.includes(":") && inputTime.split(":").length === 3
      ? "HH:mm:ss"
      : "HH:mm";

  // Chuyển đổi thời gian input và tạo khoảng thời gian kiểm tra
  const inputMoment = moment(inputTime, timeFormat);
  const startTime = moment("01:00", "HH:mm");
  const endTime = moment(formatTimeFromDB(checkout_setting), "HH:mm");

  // Kiểm tra xem inputTime có nằm trong khoảng từ 1:00 đến 17:00 hay không
  return inputMoment.isBetween(startTime, endTime, null, "[)");
}
const isTime1GreaterOrEqual = (time1, time2) => {
  const format = "HH:mm"; // Định dạng thời gian
  const time1Moment = moment(time1, format);
  const time2Moment = moment(time2, format);

  return time2Moment.isSameOrAfter(time1Moment);
};
const isDate2Greater = (date1, date2) => {
  const date1Moment = moment(date1); // ISO format không cần format cụ thể
  const date2Moment = moment(date2);

  return date2Moment.isSameOrAfter(date1Moment);
};
function isSaturdayOrOutsideWorkingHours(
  timeString,
  createdAt,
  checkout_setting
) {
  // Kiểm tra nếu timeString là hợp lệ
  if (
    !timeString ||
    typeof timeString !== "string" ||
    timeString.trim() === ""
  ) {
    return false;
  }

  // Kiểm tra nếu createdAt là chuỗi
  if (!createdAt || typeof createdAt !== "string") {
    return false;
  }

  // Khởi tạo biến createdMoment
  let createdMoment;

  // Kiểm tra xem createdAt có phải là một định dạng ngày giờ ISO không
  if (moment(createdAt, moment.ISO_8601, true).isValid()) {
    createdMoment = moment(createdAt); // Định dạng ISO 8601
  } else {
    // Nếu không phải định dạng ISO 8601, thử xử lý kiểu "Thứ 6, 3.01.2025"
    const datePattern = /(?:Thứ\s\d+,\s)?(\d{1,2})\.(\d{1,2})\.(\d{4})/;
    const match = createdAt.match(datePattern);

    if (match) {
      const day = match[1];
      const month = match[2] - 1; // Moment.js sử dụng tháng từ 0 (tháng 1 là 0)
      const year = match[3];

      createdMoment = moment(new Date(year, month, day)); // Tạo đối tượng moment từ ngày đã tách
    }
  }

  // Kiểm tra xem createdMoment có hợp lệ không
  if (!createdMoment || !createdMoment.isValid()) {
    // console.error("Ngày tạo không hợp lệ:", createdAt);
    return false; // Nếu không hợp lệ, trả về false
  }

  // Kiểm tra xem createdMoment có phải là thứ Bảy không (weekday() trả về 6 cho thứ Bảy)
  const isSaturday = createdMoment.weekday() === 6;

  // Parse timeString thành moment object với định dạng "HH:mm:ss"
  const timeMoment = moment(timeString, "HH:mm:ss", true);

  // Kiểm tra timeString có hợp lệ không
  if (!timeMoment.isValid()) {
    // console.error("Thời gian không hợp lệ:", timeString);
    return false;
  }

  // Thời gian kiểm tra dựa trên yêu cầu
  const noonMoment = moment("12:00:00", "HH:mm:ss"); // 12h trưa
  const eveningMoment = moment(checkout_setting, "HH:mm:ss"); // 17h chiều

  if (isSaturday) {
    // Nếu là thứ Bảy, kiểm tra thời gian có sau 12h trưa không
    return timeMoment.isSameOrAfter(noonMoment);
  } else {
    // Nếu không phải thứ Bảy, kiểm tra thời gian có sau 17h không
    return timeMoment.isSameOrAfter(eveningMoment);
  }
}

function isSaturday(createdAt) {
  // Chuyển đổi createdAt thành đối tượng moment
  const createdDate = moment(createdAt);

  // Kiểm tra định dạng có hợp lệ không
  if (!createdDate.isValid()) {
    throw new Error("Định dạng created_at không hợp lệ");
  }

  // Kiểm tra ngày có phải thứ 7 không
  return createdDate.isoWeekday() === 6; // Thứ 7 là 6 trong isoWeekday
}
function validateTimeRange(
  start_time,
  end_time,
  dateString,
  checkin_setting,
  checkout_setting
) {
  // Kiểm tra nếu start_time hoặc end_time null/undefined/""
  if (!start_time || !end_time) {
    return false;
  }

  // Chuyển đổi dateString sang đối tượng moment
  const inputDate = moment(dateString, "YYYY-MM-DD");
  if (!inputDate.isValid()) {
    return false;
  }

  // Xác định ngày không phải Thứ 7 (weekday khác 6)
  const isSaturday = inputDate.day() === 6;

  // Chuyển đổi start_time và end_time sang đối tượng moment
  const startTime = moment(start_time, ["HH:mm:ss", "HH:mm"], true);
  const endTime = moment(end_time, ["HH:mm:ss", "HH:mm"], true);

  // Kiểm tra tính hợp lệ của thời gian
  if (!startTime.isValid() || !endTime.isValid()) {
    return false;
  }

  // Đặt các mốc thời gian chuẩn
  const eightAM = moment(checkin_setting, "HH:mm:ss"); // 8h sáng
  const fivePM = moment(checkout_setting, "HH:mm:ss"); // 5h chiều
  const twelvePM = moment("12:00:00", "HH:mm:ss"); // 12h trưa

  if (!isSaturday) {
    // Nếu không phải Thứ 7
    if (startTime.isSameOrBefore(eightAM) && endTime.isSameOrAfter(fivePM)) {
      return true; // Đúng giờ
    }
    if (startTime.isAfter(eightAM) || endTime.isBefore(fivePM)) {
      return false; // Trong khoảng sau 8h sáng và trước 5h chiều
    }
  } else {
    // Nếu là Thứ 7
    if (startTime.isSameOrBefore(eightAM) && endTime.isSameOrAfter(twelvePM)) {
      return true; // Đúng giờ
    }
    if (startTime.isAfter(eightAM) || endTime.isBefore(twelvePM)) {
      return false; // Trong khoảng sau 8h sáng và trước 12h trưa
    }
  }

  // Nếu không thỏa bất kỳ điều kiện nào
  return false;
}
const convertToMidnightUTC = (timeString) => {
  const date = new Date(timeString); // Tạo đối tượng Date từ chuỗi ISO
  const year = date.getUTCFullYear(); // Lấy năm theo UTC
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, thêm '0' nếu cần
  const day = String(date.getUTCDate()).padStart(2, "0"); // Ngày, thêm '0' nếu cần
  return `${year}-${month}-${day}`; // Trả về định dạng yyyy-mm-dd
};
const getValueBefore = (inputString) => {
  const delimiter = "Nơi công tác";
  const index = inputString.indexOf(delimiter);
  return index !== -1 ? inputString.substring(0, index).trim() : inputString;
};

// Hàm 2: Lấy giá trị sau dấu ":"
const getValueAfter = (inputString) => {
  const delimiter = ":";
  const index = inputString.indexOf(delimiter);
  return index !== -1 ? inputString.substring(index + 1).trim() : "";
};
const groupNotificationsByDate = (data) => {
  // Sử dụng reduce để nhóm theo ngày
  const grouped = data.reduce((acc, item) => {
    // Tách ngày từ created_at (yyyy-mm-dd)
    const date = item.created_at.split("T")[0];

    // Nếu nhóm này chưa tồn tại thì khởi tạo một mảng mới
    if (!acc[date]) {
      acc[date] = [];
    }

    // Thêm item vào nhóm
    acc[date].push(item);

    return acc;
  }, {});

  // Chuyển nhóm thành cấu trúc mảng với mỗi ngày có một danh sách thông báo
  const result = Object.keys(grouped).map((date) => ({
    date: date,
    notificationList: grouped[date],
  }));

  // Sắp xếp các nhóm theo ngày từ mới nhất đến cũ nhất
  result.sort((a, b) => new Date(b.date) - new Date(a.date));

  return result;
};

const formatTimeNotification = (inputTime) => {
  const date = new Date(inputTime);

  // Lấy giờ, phút, giây
  const hours = String(date.getHours()).padStart(2, "0"); // Đảm bảo 2 chữ số
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Lấy ngày, tháng, năm
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng thêm 1
  const year = date.getFullYear();

  // Định dạng lại chuỗi theo "hh:mm:ss - dd/mm/yyyy"
  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};
const betweenTime = (timeString) => {
  const targetTime = new Date(timeString);
  const currentTime = new Date();

  // Tính khoảng thời gian (milliseconds)
  const difference = currentTime - targetTime;

  // Tính số ngày, giờ, phút, giây
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Nếu chênh lệch lớn hơn 24 giờ (1 ngày), trả về thời gian đầy đủ
  if (hours >= 24) {
    const formattedHours = targetTime.getUTCHours().toString().padStart(2, "0");
    const formattedMinutes = targetTime
      .getUTCMinutes()
      .toString()
      .padStart(2, "0");
    const formattedSeconds = targetTime
      .getUTCSeconds()
      .toString()
      .padStart(2, "0");

    const date = targetTime.getUTCDate().toString().padStart(2, "0");
    const month = (targetTime.getUTCMonth() + 1).toString().padStart(2, "0"); // Tháng tính từ 0
    const year = targetTime.getUTCFullYear();

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} - ${date}/${month}/${year}`;
  }

  // Nếu chênh lệch dưới 24 giờ, trả về dạng "xx tiếng trước", "xx phút trước", "xx giây trước"
  if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} tiếng trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else if (seconds > 0) {
    return `${seconds} giây trước`;
  }

  return "Vừa xong";
};

const notToday = (dateString) => {
  const today = new Date();

  const inputDate = new Date(dateString);

  // Chỉ so sánh ngày (bỏ qua phần giờ, phút, giây)
  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const inputDateWithoutTime = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  // Kiểm tra nếu ngày khác hôm nay
  if (todayWithoutTime.getTime() !== inputDateWithoutTime.getTime()) {
    return true;
  } else {
    return false;
  }
};

const convertMonthYearsString = (dateStr) => {
  // Tạo đối tượng Date từ chuỗi
  if (typeof dateStr === "string" && dateStr.trim() !== "") {
    // Tách chuỗi thành năm, tháng, ngày
    const [year, month, day] = dateStr.split("-");

    // Kiểm tra xem tách chuỗi có hợp lệ hay không
    if (year && month && day) {
      // Đảm bảo tháng có 2 chữ số
      const monthFormatted = String(month).padStart(2, "0");

      // Tạo chuỗi "Tháng ${month}, năm ${year}"
      const result = `${monthFormatted}, năm ${year}`;
      return result; // "Tháng 12, năm 2024"
    } else {
      console.error("Chuỗi ngày không hợp lệ.");
    }
  } else {
    console.error("Dữ liệu đầu vào không phải là chuỗi hợp lệ.");
  }
};
function isBeforeCurrentTime(timeString) {
  // Lấy thời gian hiện tại
  const currentTime = moment(); // Moment hiện tại

  // Kiểm tra định dạng và phân tích chuỗi thời gian "hh:mm" hoặc "hh:mm:ss"
  const time = moment(timeString, ["HH:mm", "HH:mm:ss"], true); // true để kiểm tra tính chính xác của định dạng

  // Kiểm tra nếu thời gian đầu vào hợp lệ
  if (!time.isValid()) {
    console.error("Invalid time format");
    return false;
  }

  // Kiểm tra xem thời gian hiện tại có trước thời gian đã cho không
  return currentTime.isBefore(time);
}
function getHoursFromSetting(timeString) {
  return timeString.split(":")[0]; // Lấy phần giờ (hh)
}

function getMinutesFromSetting(timeString) {
  return timeString.split(":")[1]; // Lấy phần phút (mm)
}
function getHourMinuteFromSetting(timeString) {
  const parts = timeString.split(":");
  return `${parts[0]}:${parts[1]}`; // Ghép hh và mm
}
export {
  getHoursFromSetting,
  getMinutesFromSetting,
  getHourMinuteFromSetting,
  notToday,
  convertMonthYearsString,
  betweenTime,
  formatTimeNotification,
  groupNotificationsByDate,
  getValueBefore,
  getValueAfter,
  convertToMidnightUTC,
  formatDateString,
  isAfterFive,
  calculateDuration,
  getDayName,
  getCurrentTimeFormatted,
  getCurrentTimeCheckInCheckOut,
  getCalendarByUser,
  getMonthByUser,
  getYearhByUser,
  convertTimeFormat,
  convertTimeString,
  convertTimeStringHistory,
  subtractTime,
  calculateDurationHistory,
  addHoursToTimeString,
  isCurrentTimeAfterOneHour,
  formatDateStringBirth,
  calculateWorkingTime,
  isDateBeforeOrEqualToday,
  timeDifferenceFromEightAM,
  timeDifferenceToFivePM,
  isSunday,
  isDateBeforeOrEqualToday1,
  convertDateFormat,
  formatDateToVN,
  splitNumberFormTime,
  getWeekNumber,
  groupByWeek,
  formatDate,
  isTime1LessThanTime2,
  isBeforeEight,
  isBeforeFive,
  getAttendanceByWeek,
  subtractTimeNew,
  isDateMoreThanOneMonthAgoAndTodayIs10,
  subtractTimeResume,
  checkTimes,
  isTimeBetween8And5,
  isWithinWorkingHours,
  isTime1GreaterOrEqual,
  isDate2Greater,
  calculateWorkingTimeSaturday,
  subtractTimeNewSaturday,
  isSaturdayOrOutsideWorkingHours,
  isSaturday,
  validateTimeRange,
  isDateInRange,
  formatTimeFromDB,
  isBeforeCurrentTime,
};
