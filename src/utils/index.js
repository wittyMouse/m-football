// 填充零
export function formatNumber(n) {
  const s = n.toString();
  return s[1] ? s : `0${s}`;
}

// 通过 Date 对象获取格式化的字符串时间
export function formatDate(date, format) {
  const onlyWordRegExp = new RegExp("^\\w+$");
  const year = date.getFullYear().toString();
  const month = formatNumber(date.getMonth() + 1);
  const day = formatNumber(date.getDate());

  const dateString = format.replace(/(\w+)|(\W+)/g, (s) => {
    if (onlyWordRegExp.test(s)) {
      let rs = "";
      let length = 0;
      switch (s[0]) {
        case "Y":
          length = s.length < 5 ? s.length : 4;
          rs = year.slice(-length);
          break;
        case "M":
          length = s.length < 3 ? s.length : 2;
          rs = month.slice(-length);
          break;
        case "D":
          length = s.length < 3 ? s.length : 2;
          rs = day.slice(-length);
          break;
        default:
          rs = "";
          break;
      }
      return rs;
    }
    return s;
  });
  return dateString;
}

export function isWXEnv() {
  return navigator.userAgent.indexOf("MicroMessenger") > -1;
}

/**
 * 解析查询字符串
 * @param {*} queryString
 */
export function parseQueryString(queryString) {
  const queryStringObject = {};
  queryString
    .replace("?", "")
    .split("&")
    .forEach((item) => {
      const [key, value] = item.split("=");
      queryStringObject[key] = value;
    });
  return queryStringObject;
}
