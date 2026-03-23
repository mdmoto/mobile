/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
  im: "https://im-api.maollar.com",
  common: "https://common-api.maollar.com",
  buyer: "https://api.maollar.com/buyer", 
};

// 生产环境
const prod = {
  im: "https://im-api.maollar.com",
  common: "https://common-api.maollar.com",
  buyer: "https://api.maollar.com/buyer", 
};

//默认生产环境
let api = dev;
//如果是开发环境
if (process.env.NODE_ENV == "development") {
  api = dev;
} else {
  api = prod;
}
//微信小程序，app的打包方式建议为生产环境，所以这块直接条件编译赋值
// #ifdef MP-WEIXIN || APP-PLUS
api = prod;
// #endif

// 所有路径已在下方常量中通过绝对路径指定完整，不再需要动态追加
export default {
  ...api,
};
