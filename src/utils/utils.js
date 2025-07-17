import axios from "axios";

/*异步等待一段时间*/
export function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}
/*获取cookie*/
export function getCookie(name) {
  var regexp = new RegExp("(?:^" + name + "|;\\s*" + name + ")=(.*?)(?:;|$)", "g");
  var result = regexp.exec(document.cookie);
  return result === null ? null : decodeURIComponent(result[1]);
}
/*删除cookie*/
export function delCookie(name, path, domain, secure) {
  if (getCookie(name)) {
    var expires = new Date();
    expires.setTime(expires.getTime() + -10 * 1000);
    domain = domain ? domain : "";
    path = path ? path : "/";
    var newCookie =
      escape(name) +
      "=" +
      escape("") +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      "; path=" +
      path +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
    document.cookie = newCookie;
  }
}
// 删除所有的cookie
export function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--; ) document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
  }
}

Array.prototype.max = function () {
  return Math.max.apply({}, this);
};
Array.prototype.min = function () {
  return Math.min.apply({}, this);
};

//获取url参数
export function getUrlParams(s) {
  let strs;
  var url = decodeURIComponent(location.href);
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.split("?")[1];
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
    }
  }
  return theRequest;
}

//防抖
export function debounce(fn, delay = 500) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

//统计上报
export async function reportStats({ event_id, event_info }) {
  try {
    const response = await axios.post("https://eventapi.wedengta.com/report", {
      project_id: "screenshot",
      event_id,
      app_info: {},
      event_info: event_info || {},
    });
    // console.log(response.data);
  } catch (error) {
    // console.error('reportStats error:', error);
  }
}
