//用户相关模块的属性类型
export interface RegisterUser {
  username: string;
  password: string;
  nickName: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}
export interface UpdatePassword {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}
export interface UserInfo {
  avatar: string;
  nickName: string;
  email: string;
  captcha: string;
}

