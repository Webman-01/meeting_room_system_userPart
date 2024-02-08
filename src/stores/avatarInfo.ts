import { defineStore } from "pinia";

//用户的头像信息
export const useAvatarInfoStore = defineStore("avatarInfo", {
  state: () => {
    return {
      avatarUrl: "",
    };
  },
});
