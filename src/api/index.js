import request from "../utils/axios";

/**
 * 获取 openId
 * @param {*} data
 */
export function requestOpenId(data) {
  return request.request({
    url: "/api/member/getOpenid",
    method: "post",
    data,
  });
}

/**
 * 获取 jssdk 授权参数
 * @param {*} data
 */
export function requestJSSDKConfig(data) {
  return request.request({
    url: "/api/member/getJSSDKConfig",
    method: "post",
    data,
  });
}

/**
 * 获取验证码
 * @param {*} params
 */
export function requestCaptcha(params) {
  const { timestamp } = params;
  return request.request({
    url: `/sys/randomImage/${timestamp}`,
    method: "get",
  });
}

/**
 * 账号登录
 * @param {*} data
 */
export function requestLogin(data) {
  return request.request({
    url: "/api/member/login",
    method: "post",
    data,
  });
}

/**
 * 获取会员信息
 * @param {*} data
 */
export function requestUserInfo(data) {
  return request.request({
    url: "/api/member/getMemberInfo",
    method: "post",
    data,
  });
}

/**
 * 退出登录
 * @param {*} data
 */
export function requestLogout(data) {
  return request.request({
    url: "/api/member/logout",
    method: "post",
    data,
  });
}

/**
 * 注册
 * @param {*} data
 */
export function requestRegister(data) {
  return request.request({
    url: "/api/member/register",
    method: "post",
    data,
  });
}

/**
 * 修改会员信息
 * @param {*} data
 */
export function requestModify(data) {
  return request.request({
    url: "/api/member/updatePassword",
    method: "post",
    data,
  });
}

/**
 * 获取文章分类列表
 * @param {*} data
 */
export function requestArticleList(data) {
  return request.request({
    url: "/api/member/articleListByColumn",
    method: "post",
    data,
  });
}

/**
 * 胜率榜
 * @param data
 */
export function requestRankingList(data) {
  return request.request({
    url: "/api/member/winningList",
    method: "post",
    data,
  });
}

/**
 * 胜场榜（图表）
 * @param data
 */
export function requestRankingChart(data) {
  return request.request({
    url: "/api/member/winningCountList",
    method: "post",
    data,
  });
}

/**
 * 根据部门 Id 获取用户信息
 * @param data
 */
export function requestAuthorInfoList(data) {
  return request.request({
    url: "/api/member/selectUserByDepartId",
    method: "post",
    data,
  });
}

/**
 * 根据发布人获取文章分页列表
 * @param data
 */
export function requestArticleListByAuthor(data) {
  return request.request({
    url: "/api/member/articleListByPage",
    method: "post",
    data,
  });
}

/**
 * 获取发布会员详细信息
 * @param data
 */
export function requestAuthorInfo(data) {
  return request.request({
    url: "/api/member/getUserInfo",
    method: "post",
    data,
  });
}

/**
 * 根据发布人获取至尊推荐分页列表
 * @param data
 */
export function requestRecommendList(data) {
  return request.request({
    url: "/api/member/marketingListByPage",
    method: "post",
    data,
  });
}

/**
 * 至尊推介订购
 * @param data
 */
export function requestSubscribe(data) {
  return request.request({
    url: "/api/member/subscribe",
    method: "post",
    data,
  });
}

/**
 * 至尊推介订购批量下单
 * @param data
 */
export function requestBatchSubscribe(data) {
  return request.request({
    url: "/api/member/subscribeBatch",
    method: "post",
    data,
  });
}

/**
 * 最新发布
 * @param data
 */
export function requestLatestArticleList(data) {
  return request.request({
    url: "/api/member/latestArticleList",
    method: "post",
    data,
  });
}

/**
 * 获取文章详情
 * @param data
 */
export function requestArticleDetail(data) {
  return request.request({
    url: "/api/member/getArticleInfo",
    method: "post",
    data,
  });
}

/**
 * 获取重大利好数据
 * @param data
 */
export function requestBestNews(data) {
  return request.request({
    url: "/api/member/getPageConfigById",
    method: "post",
    data,
    // header: {
    //   "content-type": "application/x-www-form-urlencoded",
    // },
  });
}

/**
 * 文章购买
 * @param data
 */
export function requestBuyArticle(data) {
  return request.request({
    url: "/api/member/buyArticle",
    method: "post",
    data,
  });
}

/**
 * 录音回放列表
 * @param data
 */
export function requestRecordList(data) {
  return request.request({
    url: "/api/member/findRecordList",
    method: "post",
    data,
  });
}

/**
 * 获取签到配置
 * @param data
 */
export function requestCheckInConfig(data) {
  return request.request({
    url: "/api/member/signInConfigList",
    method: "post",
    data,
  });
}

/**
 * 签到
 * @param data
 */
export function requestCheckIn(data) {
  return request.request({
    url: "/api/member/checkIn",
    method: "post",
    data,
  });
}

/**
 * 签到信息
 * @param data
 */
export function requestCheckInInfo(data) {
  return request.request({
    url: "/api/member/checkInInfo",
    method: "post",
    data,
  });
}

/**
 * 获取充值赠送配置列表
 * @param data
 */
export function requestPriceList(data) {
  return request.request({
    url: "/api/member/donateConfigList",
    method: "post",
    data,
  });
}

/**
 * 发起支付
 * @param data
 */
export function requestCreateOrder(data) {
  return request.request({
    url: "/api/member/createOrderByJs",
    method: "post",
    data,
  });
}

/**
 * 充值与消费记录（所有流水账记录）
 * @param data
 */
export function requestAmountChangeList(data) {
  return request.request({
    url: "/api/member/amountChangeListByPage",
    method: "post",
    data,
  });
}

/**
 * 批量删除账变记录
 * @param data
 */
export function requestDeleteAmountChange(data) {
  return request.request({
    url: "/api/member/batchDeleteAmountChange",
    method: "post",
    data,
  });
}

/**
 * 至尊推介订购（记录）
 * @param data
 */
export function requestSubscribeRecordList(data) {
  return request.request({
    url: "/api/member/subscribeRecordListByPage",
    method: "post",
    data,
  });
}

/**
 * 批量删除至尊订阅记录
 * @param data
 */
export function requestDeleteSubscribeRecord(data) {
  return request.request({
    url: "/api/member/batchDeleteBuyRecord",
    method: "post",
    data,
  });
}

/**
 * 最新线报推介（记录）
 * @param data
 */
export function requestBuyRecordList(data) {
  return request.request({
    url: "/api/member/buyRecordListByPage",
    method: "post",
    data,
  });
}

/**
 * 批量删除文章购买记录
 * @param data
 */
export function requestDeleteBuyRecord(data) {
  return request.request({
    url: "/api/member/batchDeleteBuyRecord",
    method: "post",
    data,
  });
}

/**
 * 获取广告配置信息
 * @param data
 */
export function requestAdConfigInfo(data) {
  return request.request({
    url: "/api/member/getAdConfigInfo",
    method: "post",
    data,
  });
}

/**
 * 发送短信验证码
 * @param data
 */
export function requestPhoneCode(data) {
  return request.request({
    url: "/sys/getPhoneCode",
    method: "post",
    data,
  });
}

/**
 * 获取渠道列表
 * @param token
 */
export function requestChannelList() {
  return request.request({
    url: "/api/member/channelList",
    method: "post",
  });
}

/**
 * 根据二维码进行登录
 * @param token
 */
export function requestLoginByQRCode(data) {
  return request.request({
    url: "/api/member/loginByQRCode",
    method: "post",
    data,
  });
}

/**
 * 微信注册
 * @param token
 */
export function requestRegisterByWechat(data) {
  return request.request({
    url: "/api/member/registerByWechat",
    method: "post",
    data,
  });
}

/**
 * 修改会员信息
 * @param token
 */
export function requestEditMemberInfo(data) {
  return request.request({
    url: "/api/member/editMemberInfo",
    method: "post",
    data,
  });
}

/**
 * 文章推介购买
 * @param token
 */
export function requestBuyArticleMarketing(data) {
  return request({
    url: "/api/member/buyArticleMarketing",
    method: "post",
    data,
  });
}

/**
 * 获取 token
 * @param { redirectUrl: string }
 */
export function requestAuxiliaryRedirect(params) {
  const urlSearchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    urlSearchParams.append(key, params[key]);
  });
  return request({
    url: "/auxiliary/redirect",
    method: "get",
    params,
  });
}

/**
 * 校验token接口
 * @param { token: string }
 */
export function requestAuxiliaryCheckToken(params) {
  return request({
    url: "/auxiliary/checkToken",
    method: "get",
    params,
  });
}
