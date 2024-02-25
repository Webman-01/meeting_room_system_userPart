import axios, { type AxiosRequestConfig } from "axios";
import type {
  RegisterUser,
  UpdatePassword,
  UserInfo,
} from "../types/user.types";
import { message } from "ant-design-vue";
import type { SearchBookingData } from "@/views/bookingHistory.vue";
import dayjs from "dayjs";
import type { CreateBooking } from "@/types/booking.types";

//创建axios实例
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

//refreshToken
export async function refreshToken() {
  //获取localStorage中的refresh_token发起刷新token请求获取新的access_token和refresh_token
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  const { data } = res.data;
  localStorage.setItem("access_token", data.access_token || "");
  localStorage.setItem("refresh_token", data.refresh_token || "");
  return res;
}
//通过响应,请求拦截器实现无感刷新登录
//请求拦截器
//1. 在每次发请求之前，在 header 里加上 authorization，带上 access_token
axiosInstance.interceptors.request.use(function (config) {
  //从localStorage中获取access_token
  const accessToken = localStorage.getItem("access_token");

  //添加给header
  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});
//响应拦截器
interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    //如果没有 error.response，说明是网络请求失败（例如无法连接到服务器）
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    // 如果正在刷新 Token，将当前请求加入队列，等待刷新完成后重新发送
    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }
    // 当响应码是 401 且没有发送刷新请求的时候，就刷新 token，刷新失败提示错误信息，然后跳到登录页
    if (data.code == 401 && !config.url.includes("/user/refresh")) {
      // console.log(config, "config");

      refreshing = true; // 标记正在刷新 Token
      const res = await refreshToken();
      refreshing = false; // 标记刷新完成

      if (res.status == 200) {
        // 如果刷新成功，重新发送之前被拦截的请求
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });
        return axiosInstance(config);
      } else {
        message.error(res.data);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);
//登陆界面接口
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}
//注册界面的接口
export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}
export async function register(registerUser: RegisterUser) {
  return axiosInstance.post("/user/register", registerUser);
}
//修改密码界面接口
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/update_password", data);
}
//修改用户信息界面的接口
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}
export async function updateUserInfo(data: UserInfo) {
  return await axiosInstance.post("/user/update_userInfo", data);
}
export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/updateUserInfo/captcha");
}
//获取会议室列表
export async function meetingRoomList(
  name: string,
  capacity: string,
  equipment: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/meeting-room/list", {
    params: {
      name,
      capacity,
      equipment,
      pageNo,
      pageSize,
    },
  });
}
//获取用户预订列表
export async function bookingList(
  searchBooking: SearchBookingData,
  pageNo: number,
  pageSize: number
) {
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;
  if (searchBooking.rangeStartTime) {
    bookingTimeRangeStart = dayjs(
      dayjs(searchBooking.rangeStartTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }
  if (searchBooking.rangeEndTime) {
    bookingTimeRangeEnd = dayjs(
      dayjs(searchBooking.rangeEndTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }
  return await axiosInstance.get("/booking/list", {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}
//解除预订
export async function unbind(id: number) {
  return await axiosInstance.get("/booking/unbind/" + id);
}
//添加会议室
export async function bookingAdd(booking: CreateBooking,userId:number) {
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;
  if (booking.rangeStartTime) {
    bookingTimeRangeStart = dayjs(
      dayjs(booking.rangeStartTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }
  if (booking.rangeEndTime) {
    bookingTimeRangeEnd = dayjs(
      dayjs(booking.rangeEndTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }
  return await axiosInstance.post("/booking/add", {
    meetingRoomId: booking.meetingRoomId,
    startTime: bookingTimeRangeStart,
    endTime: bookingTimeRangeEnd,
    text: booking.text,
    id:userId
  });
}
//根据会议室名称获取预订情况
export async function getBookingByMeetingRoomName(meetingRoomName: string) {
  return await axiosInstance.get("/booking/list", {
    params: {
      meetingRoomName,
    },
  });
}

