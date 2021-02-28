import { rand } from "./utils.js";

export const service = {
  getRandomNumber({ min = 0, max = 100 } = {}) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        return res(rand(min, max));
      }, 1500);
    });
  },
  getBugsCount() {
    return this.getRandomNumber();
  },
};
