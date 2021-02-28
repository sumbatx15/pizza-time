export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const repeat = (func, { times, delay }) => {
  if (times == 0) return;
  func();
  setTimeout(() => repeat(func, { times: --times, delay }), delay);
};

export const createElementFromHTML = (htmlString) => {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};
