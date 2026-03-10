<template>
  <div class="wrapper">
    <div class="box">
      <div class="block block-1">
        <image class="img" src="@/pages/cart/static/pay.png" />
        <p class="ptips">收银台</p>

        <p class="ptips">剩余支付时间：
          <u-count-down :show-days="false" :show-border="true" font-size="28" color="#008ffa" border-color="#008ffa" ref="uCountDown" :timestamp="autoCancel"></u-count-down>
        </p>
        <p class="ptips">
          支付金额
          <span>¥{{ unitPrice(cashierParams.price) }}</span>
        </p>
      </div>
    </div>
    <div class="__pay_form__">
    </div>
    <div class="block-4" v-if="cashierParams.price > 0">
      <div class="payItem">支付方式</div>
      <div class="payItem" v-for="(item, index) in payList" :key="index">
        <u-row class="row">
          <div class="col1" @click="awaitPay(item, index)" size="100" style="text-align:left;">
            <div v-if="item == 'ALIPAY'">
              <u-icon class="method_icon" name="zhifubao-circle-fill" color="#008ffa" size="80"></u-icon>
              <span class="method_name">支付宝</span>
            </div>
            <div v-if="item == 'WECHAT'">
              <u-icon class="method_icon" name="weixin-circle-fill" color="#00c98b" size="80"></u-icon>
              <span class="method_name">微信</span>
            </div>
            <div v-if="item == 'WALLET'">
              <u-icon class="method_icon" name="red-packet-fill" color="#dd6161" size="80"></u-icon>
              <span class="method_name">余额支付(当前余额：¥{{ unitPrice(walletValue) }})</span>
            </div>
          </div>
          <div class="col3" @click="awaitPay(item)" textAlign="right">
            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
          </div>
        </u-row>
      </div>
    </div>
  </div>
</template>
<script>
	import * as API_Trade from "@/api/trade";
	import {payCallback} from '@/api/members'
	export default {
		data() {
			return {
				//路径传参
				routerVal: "",
				//收银台参数
				cashierParams: "",
				//支付方式集合
				payList: "",
				//支付sn
				sn: "",
				//订单类型
				orderType: "",
				//支付异常
				exception: {},
				//支付表单
				payForm: {},
				//支付类型 APP/WECHAT_MP/H5/NATIVE app/微信小程序/h5/二维码
				paymentType: "",
				// 支付客户端 APP/NATIVE/JSAPI/H5
				paymentClient: "",
				//余额
				walletValue: 0.0,
				// 支付倒计时
				autoCancel: 0,
			
			};
		},
		onLoad(val) {
			this.routerVal = val;

			//初始化参数
			// #ifdef APP-PLUS
			this.paymentType = "APP";
			this.paymentClient = "APP";
			//#endif
			// #ifdef MP-WEIXIN
			this.paymentType = "WECHAT_MP";
			this.paymentClient = "MP";
			//#endif
			// #ifdef H5
			this.paymentType = "H5";
			//如果是微信浏览器，则使用公众号支付，否则使用h5，
			// 区别是：h5是通过浏览器外部调用微信app进行支付，而JSAPI则是 在微信浏览器内部，或者小程序 调用微信支付
			this.paymentClient = this.isWeiXin() ? "JSAPI" : "H5";
			//#endif



			// 
		},
		onBackPress(e) {
			if (e.from == "backbutton") {
							if(this.routerVal.recharge_sn){
								uni.switchTab({
									 url: '/pages/tabbar/user/my'
								});
							}
							else{
							uni.navigateTo({
								url: "/pages/order/myOrder?status=0",
							});
							}
							return true; //阻止默认返回行为
							}
		},
		mounted() {
			this.cashierData();
		},
		methods: {

			/**
			 * 支付成功后跳转
			 */
			callback(paymentMethod){
				uni.navigateTo({
					url: "/pages/cart/payment/success?paymentMethod=" +
					paymentMethod +
					"&payPrice=" +
					this.cashierParams.price+
					"&orderType="+this.orderType 
				});
			},
			
			/**
			 * 获取收银详情
			 */
			async cashierData() {
				let parms = {};

				if (this.routerVal.recharge_sn) {
					// 判断当前是否是充值
					this.sn = this.routerVal.recharge_sn;
					this.orderType = "RECHARGE";
				} else if (this.routerVal.trade_sn) {
					this.sn = this.routerVal.trade_sn;
					this.orderType = "TRADE";
				} else {
					this.sn = this.routerVal.order_sn;
					this.orderType = "ORDER";
				}
				parms.sn = this.sn;
				parms.orderType = this.orderType;
				parms.clientType = this.paymentType;

				try {
					const result = await API_Trade.getCashierData(parms);
					console.log('收银台数据:', result);
					this.cashierParams = result;
					
					// #ifdef MP-WEIXIN
					this.payList = result.support.filter((item) => item != "ALIPAY");
					// #endif

					if (this.routerVal.recharge_sn) {
						this.payList = result.support.filter((item) => item != "WALLET");
					} else {
						this.payList = result.support;
					}
					
					// #ifdef H5
					var ua = window.navigator.userAgent.toLowerCase();
					if (ua.match(/MicroMessenger/i) == 'micromessenger') {
						this.payList = result.support.filter((item) => item != "ALIPAY");
						if (this.orderType == "RECHARGE") {
							this.payList = result.support.filter((item) => item == "WECHAT");
						}
					}
					// #endif

					this.walletValue = result.walletValue;
					this.autoCancel = (result.autoCancel - new Date().getTime()) / 1000;
				} catch (err) {
					console.error('获取收银台数据异常:', err);
					if (err.code == 32000) {
						setTimeout(() => {
							uni.redirectTo({ url: `/pages/order/myOrder?status=0` });
						}, 500);
					} else {
						uni.showToast({
							title: err.message || '获取支付方式失败',
							icon: 'none',
							duration: 2000
						});
					}
				}
			},


			awaitPay(payment){
				uni.$u.throttle(()=>{
					this.pay(payment)
				}, 2000)
			},

			//订单支付
			async pay(payment) {
				
				// 支付编号
				const sn = this.sn;
				// 交易类型【交易号|订单号】
				const orderType = this.orderType;

				const clientType = this.paymentType;
				let params = {
					sn,
					orderType,
					clientType,
				};

				//支付方式 WECHAT/ALIPAY
				const paymentMethod = payment;
				// 客户端类型 APP/NATIVE/JSAPI/H5
				const paymentClient = this.paymentClient;
				
				uni.showLoading({
				  title: "正在唤起支付...",
				  mask:true
				});
				
				// #ifdef APP-PLUS
				//APP pay
				// 初始化支付签名
				try {
					const result = await API_Trade.initiatePay(paymentMethod, paymentClient, params);
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					
					let payForm = result;
					let paymentType = paymentMethod === "WECHAT" ? "wxpay" : "alipay";
					
					if (paymentMethod === "WALLET") {
						uni.showToast({ icon: "none", title: "支付成功!" });
						this.callback(paymentMethod);
					} else {
						uni.requestPayment({
							provider: paymentType,
							orderInfo: payForm || '',
							success: (e) => {
								uni.showToast({ icon: "none", title: "支付成功!" });
								this.callback(paymentMethod);
							},
							fail: (e) => {
								this.exception = e;
								uni.showModal({
									content: "支付失败,如果您已支付，请勿反复支付",
									showCancel: false,
								});
							},
						});
					}
				} catch (err) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					uni.showToast({ title: err.message || '支付异常', duration: 2000, icon: 'none' });
				}
				//APP pay
				// #endif

			//#ifdef H5
			//H5 pay
			await API_Trade.initiatePay(paymentMethod, paymentClient, params).then(
				(res) => {
					console.log('支付响应完整对象:', res);
					console.log('res.data:', res.data);
					console.log('res.data类型:', typeof res.data);
					console.log('res.statusCode:', res.statusCode);
					console.log('res.header:', res.header);
					let response = res.data;
					console.log('支付响应数据:', response, '类型:', typeof response);
					
					// 首先检查支付是否失败（所有支付方式都需要先检查）
					// 检查多种错误情况：success === false, statusCode >= 400, 或者有错误信息
					if (response && typeof response === 'object') {
						// 检查success字段
						if (response.success === false || response.success === 'false') {
							console.error('支付失败 (success=false):', response);
							uni.hideLoading();
							let errorMsg = '支付失败';
							if (response.message) {
								if (typeof response.message === 'string') {
									errorMsg = response.message;
								} else if (typeof response.message === 'object') {
									errorMsg = JSON.stringify(response.message);
								}
							}
							uni.showToast({
								title: errorMsg,
								duration: 3000,
								icon:"none"
							});
							return;
						}
						// 检查statusCode（HTTP错误）
						if (res.statusCode && res.statusCode >= 400) {
							console.error('支付失败 (HTTP错误):', res.statusCode, response);
							uni.hideLoading();
							let errorMsg = '支付失败';
							if (response.message) {
								if (typeof response.message === 'string') {
									errorMsg = response.message;
								} else if (typeof response.message === 'object') {
									errorMsg = JSON.stringify(response.message);
								}
							} else if (response.code) {
								errorMsg = `支付错误 (${response.code})`;
							}
							uni.showToast({
								title: errorMsg,
								duration: 3000,
								icon:"none"
							});
							return;
						}
					}
					
					// 如果是支付宝支付，检查原始响应（成功的情况下）
					if (paymentMethod === "ALIPAY") {
						// 检查原始响应字符串
						if (res.rawData && typeof res.rawData === 'string') {
							console.log('发现原始响应数据:', res.rawData.substring(0, 200));
							if (res.rawData.includes('<form') || res.rawData.includes('alipay') || res.rawData.includes('支付宝') || res.rawData.includes('action=')) {
								console.log('从rawData提取HTML');
								document.write(res.rawData);
								return;
							}
						}
					}
					
					if (paymentMethod === "ALIPAY") {
						console.log('支付宝支付，处理响应:', typeof response, response);
						console.log('res对象完整内容:', JSON.stringify(res, null, 2));
						
						// 支付宝H5支付返回的是HTML字符串，需要直接写入
						// 首先检查rawData（原始响应数据）
						if (res.rawData && typeof res.rawData === 'string') {
							console.log('检查rawData，长度:', res.rawData.length, '前200字符:', res.rawData.substring(0, 200));
							if (res.rawData.includes('<form') || res.rawData.includes('alipay') || res.rawData.includes('支付宝') || res.rawData.includes('action=')) {
								console.log('从rawData提取HTML并写入');
								document.write(res.rawData);
								return;
							}
						}
						
						// 检查响应是否是HTML字符串（包含form标签或alipay相关）
						if (typeof response === 'string') {
							console.log('response是字符串，长度:', response.length, '前200字符:', response.substring(0, 200));
							// 直接是HTML字符串
							if (response.includes('<form') || response.includes('alipay') || response.includes('支付宝') || response.includes('action=')) {
								console.log('检测到HTML响应，直接写入');
								document.write(response);
								return;
							}
						}
						
						// 如果响应是对象，尝试提取HTML
						if (response && typeof response === 'object') {
							console.log('response是对象，keys:', Object.keys(response));
							// 检查是否有result字段且是字符串
							if (response.result && typeof response.result === 'string') {
								console.log('检查result字段，长度:', response.result.length);
								if (response.result.includes('<form') || response.result.includes('alipay') || response.result.includes('action=')) {
									console.log('从result字段提取HTML');
									document.write(response.result);
									return;
								}
							}
							// 检查data字段
							if (response.data && typeof response.data === 'string') {
								console.log('检查data字段，长度:', response.data.length);
								if (response.data.includes('<form') || response.data.includes('alipay') || response.data.includes('action=')) {
									console.log('从data字段提取HTML');
									document.write(response.data);
									return;
								}
							}
							// 如果对象中有HTML内容，尝试序列化查找
							let htmlContent = null;
							for (let key in response) {
								if (typeof response[key] === 'string' && 
									(response[key].includes('<form') || response[key].includes('alipay') || response[key].includes('action='))) {
									htmlContent = response[key];
									console.log('从key:', key, '提取HTML');
									break;
								}
							}
							if (htmlContent) {
								console.log('从对象中提取HTML');
								document.write(htmlContent);
								return;
							}
						}
						
						// 如果都不匹配，显示错误和详细信息
						console.error('支付宝支付响应格式错误，无法找到HTML内容');
						console.error('response类型:', typeof response);
						console.error('response内容:', response);
						console.error('res对象:', res);
						uni.hideLoading();
						uni.showToast({
							title: '支付响应格式错误，请查看控制台日志',
							icon: 'none',
							duration: 3000
						});
					} else if (paymentMethod === "WECHAT") {
							if (this.isWeiXin()) {
								//微信公众号支付
								WeixinJSBridge.invoke(
									"getBrandWCPayRequest",
									response.result,
									(res) => {
										if (res.err_msg == "get_brand_wcpay_request:ok") {
											// 使用以上方式判断前端返回,微信团队郑重提示：
											//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
											uni.showToast({
												icon: "none",
												title: "支付成功!",
											});
											this.callback(paymentMethod)
											 
										} else {
											uni.showModal({
												content: "支付失败,如果您已支付，请勿反复支付",
												showCancel: false,
											});
										}
									}
								);
								 if (this.$store.state.isShowToast){ uni.hideLoading() };
							} else {
								console.log('微信H5支付，跳转URL:', response.result);
								try {
									let h5Url = typeof response.result === 'string' ? JSON.parse(response.result).h5_url : response.result.h5_url;
									console.log('微信H5支付URL:', h5Url);
									if (!h5Url) {
										throw new Error('h5_url为空');
									}
									window.location.href = h5Url;
								} catch (e) {
									console.error('解析微信H5支付URL失败:', e, response.result);
									uni.hideLoading();
									uni.showToast({
										title: '支付跳转失败: ' + (e.message || '未知错误'),
										icon: 'none',
										duration: 2000
									});
									return;
								}
								const searchParams = {
									...params,
									price:this.cashierParams,
								}
								const timer = setInterval(()=>{
									payCallback(searchParams).then(res=>{
									if(res.data.result){
										clearTimeout(timer);
										uni.navigateTo({
											url:"/pages/order/myOrder"
										})
									}
								})
								},3000)
								
								 if (this.$store.state.isShowToast){ uni.hideLoading() };		
							}
						} else if (paymentMethod === "WALLET") {
							// 确保 message 是字符串
							let walletMsg = response.message || '余额支付';
							if (typeof walletMsg !== 'string') {
								walletMsg = typeof walletMsg === 'object' ? JSON.stringify(walletMsg) : String(walletMsg);
							}
							uni.showToast({
								title: walletMsg,
								icon: "none",
							});
							if (response.success) {
								this.callback(paymentMethod)
							}
						}
					}
				).catch((err) => {
					console.error('支付请求异常:', err);
					uni.hideLoading();
					// 处理错误信息
					let errorMsg = '支付失败，请稍后重试';
					if (err && err.data) {
						if (typeof err.data.message === 'string') {
							errorMsg = err.data.message;
						} else if (err.data.message) {
							errorMsg = JSON.stringify(err.data.message);
						}
					} else if (err && err.message) {
						errorMsg = err.message;
					} else if (typeof err === 'string') {
						errorMsg = err;
					}
					uni.showToast({
						title: errorMsg,
						duration: 2000,
						icon: 'none'
					});
				});
				//H5pay
				// #endif

				//#ifdef MP-WEIXIN
				//微信小程序
				await API_Trade.initiatePay(paymentMethod, paymentClient, params).then(
					(res) => {
						let response = res.data.result;
						//如果支付异常
						if (!res.data.success) {
							uni.showModal({
								content: res.data.message,
								showCancel: false,
							})
							return;
						}
						if (paymentMethod === "WECHAT") {
							uni.requestPayment({
								provider: "wxpay",
								appid: response.appid,
								timeStamp: response.timeStamp,
								nonceStr: response.nonceStr,
								package: response.package,
								signType: response.signType,
								paySign: response.paySign,
								success: (e) => {
									console.log(e);
									uni.showToast({
										icon: "none",
										title: "支付成功!",
									});
									this.callback(paymentMethod)
									 
								},
								fail: (e) => {
									console.log(e);
									this.exception = e;
									uni.showModal({
										content: "支付失败,如果您已支付，请勿反复支付",
										showCancel: false,
									});
								},
							});
						} else {
							uni.showToast({
								icon: "none",
								title: "支付成功!",
							});
							this.callback(paymentMethod)
							 
						}
					}
				);
				// #endif
			},
			isWeiXin() {
				var ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			},
		},
	};
</script>
<style scoped lang="scss">
.method_icon {
  vertical-align: middle;
}

.method_name {
  font-size: 28rpx;
  color: #999;
  padding-left: 24rpx;
}

.row {
  display: flex;
  width: 100%;
}

::v-deep  .u-row {
  width: 100% !important;
  display: flex;
  justify-content: space-between !important;
}

.method_name,
.col1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col1 {
  text-align: center;
  flex: 99;
}

.col3 {
  text-align: right;
  flex: 1;
}

.payItem {
  padding: 13px 25rpx;
  border-top: 1px solid #f9f9f9;

  line-height: 100rpx;
  font-size: 36rpx;
  color: #333;
}

.ptips {
  font-size: 32rpx;
  margin: 20rpx 0;
  color: #333;

  > span {
    font-size: 40rpx;
    color: #df5a52;
    margin-left: 10rpx;
  }
}

.img {
  width: 392rpx !important;
  height: 296rpx !important;
}

.wrapper {
  min-height: 100vh;
  height: auto;
  background: #f9f9f9;
}

.block-4 {
  background: #fff;
  color: $u-tips-color;

  > p {
    padding: 8rpx;
  }
}

.box {
  background: #fff;
  padding: 40rpx 0;
  //   justify-content: center; //这个是X轴居中
  //   align-items: center; //这个是 Y轴居中
}

.block {
  text-align: center;
  display: block;
  width: 100%;

  image {
    width: 200rpx;
    height: 200rpx;
  }
}

.block-1 {
  margin-top: 80rpx;
}

.btns {
  margin: 0 20rpx;
}
</style>
