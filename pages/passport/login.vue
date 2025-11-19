<template>
	<div class="wrapper">
		<div v-if="!wechatLogin">
			<u-navbar :is-back="showBack" :border-bottom="false"></u-navbar>
			<div>
				<div class="title">{{ loginTitleWay[current].title }}</div>
				<div :class="current == 1 ? 'desc-light' : 'desc'">
					{{ loginTitleWay[current].desc
          }}<span v-if="current == 1 && isRegisterMode">{{ email }}</span>
          <span v-if="current == 1 && !isRegisterMode">{{ mobile | secrecyMobile }}</span>
				</div>
			</div>
			
			<!-- 邀请码输入（手机号登录时需要） -->
			<div v-if="!enableUserPwdBox && current == 0" class="invite-code-section-top">
				<u-input 
					:custom-style="inviteCodeInputStyle" 
					:placeholder-style="placeholderStyle" 
					placeholder="🔐 输入邀请码"
					class="invite-code-input" 
					v-model="inviteCode" 
					maxlength="20"
					@input="checkInviteCode" />
				<div v-if="inviteCodeError" class="invite-code-error">{{ inviteCodeError }}</div>
				<div v-if="inviteCodeValid" class="invite-code-success">✓ 验证成功</div>
			</div>
			
			<!-- 注册模式：邮箱输入 -->
			<div v-show="!enableUserPwdBox && isRegisterMode">
				<div v-show="current == 0">
					<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入邮箱地址"
						class="mobile" v-model="email" type="text" />
					<div :class="!enableFetchCode || !inviteCodeValid ? 'disable' : 'fetch'" @click="fetchCode" class="btn">
						{{ inviteCodeValid ? '获取验证码' : '请先输入邀请码' }}
					</div>
					<!-- 手机号注册稍后开放提示 -->
					<div class="mobile-register-hint">
						<u-icon name="info-circle" size="14" color="#999" style="margin-right: 5rpx;"></u-icon>
						<span>手机号注册功能即将开放，敬请期待</span>
					</div>
				</div>
				<!-- 输入验证码 -->
				<div v-show="current == 1" class="box-code">
					<verifyCode type="bottom" @confirm="submitRegister" boxActiveColor="#D8D8D8" v-model="code" isFocus
						boxNormalColor="#D8D8D8" cursorColor="#D8D8D8" />

					<div class="fetch-btn">
						<u-verification-code change-text="验证码已发送（x）" end-text="重新获取验证码" unique-key="page-login"
							:seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange">
						</u-verification-code>
						<span @tap="fetchCode" :style="{ color: codeColor }">
							{{ tips }}</span>
					</div>
				</div>
			</div>

			<!-- 帐号密码登录 -->
			<div v-show="enableUserPwdBox">
				<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入手机号/邮箱/用户名"
					class="mobile" focus v-model="userData.username" />
				<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入密码"
					class="mobile" focus v-model="userData.password" type="password" />

				<div :class="!enableUserBtnColor ? 'disable' : 'fetch'" @click="passwordLogin" class="btn">
					帐号密码登录
				</div>
			</div>

			<!-- 第三方登录区域（需要邀请码） -->
			<div v-if="current != 1 && !enableUserPwdBox" class="third-party-section">
				<div class="section-divider">
					<div class="divider-line"></div>
					<div class="divider-text">第三方账号注册</div>
					<div class="divider-line"></div>
				</div>
				
				<!-- 邀请码输入 -->
				<div class="invite-code-section">
					<u-input 
						:custom-style="inviteCodeInputStyle" 
						:placeholder-style="placeholderStyle" 
						placeholder="🔐 输入邀请码"
						class="invite-code-input" 
						v-model="inviteCode" 
						maxlength="20"
						@input="checkInviteCode" />
					<div v-if="inviteCodeError" class="invite-code-error">{{ inviteCodeError }}</div>
					<div v-if="inviteCodeValid" class="invite-code-success">✓ 验证成功</div>
				</div>

				<!-- Google/Apple 按钮 -->
				<div class="flex login-list">
					<div 
						v-if="item.code" 
						:style="{ background: inviteCodeValid ? item.color : '#cccccc', opacity: inviteCodeValid ? 1 : 0.5 }" 
						class="login-item"
						v-for="(item, index) in loginList" 
						:key="index">
						<u-icon 
							v-if="item.title != 'Apple'" 
							color="#fff" 
							size="36" 
							:name="item.icon"
							@click="navigateLogin(item)">
						</u-icon>
						<u-image 
							v-else 
							src="/static/appleidButton@2x.png" 
							:lazy-load="false" 
							@click="navigateLogin(item)"
							width="70" 
							height="70" />
					</div>
				</div>
				<div v-if="!inviteCodeValid" class="login-list-tip">
					输入邀请码后可使用 Google/Apple 注册
				</div>
			</div>

			<!-- 底部分隔线 + 账号密码登录 -->
			<div v-if="current != 1" class="bottom-section">
				<div class="section-divider">
					<div class="divider-line"></div>
					<div class="divider-text">其他登录方式</div>
					<div class="divider-line"></div>
				</div>
				
				<div class="user-password-tips" @click="enableUserPwdBox = !enableUserPwdBox">
					<u-icon name="lock-fill" size="16" color="#ff5e00" style="margin-right: 5rpx;"></u-icon>
					{{ !enableUserPwdBox ? "使用账号密码登录" : "返回注册" }}
				</div>
			</div>

			<!-- 隐私协议（移到最底部） -->
			<div class="flex privacy-section" v-show="current != 1">
				<u-checkbox-group :icon-size="20" width="40rpx">
					<u-checkbox shape="circle" v-model="enablePrivacy" active-color="#FF5E00"></u-checkbox>
				</u-checkbox-group>
				<div class="tips">
					登录即代表您已同意<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>和<span @click="navigateToPrivacy('USER_AGREEMENT')">《用户协议》</span>
				</div>
			</div>
			<myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification"
				business="LOGIN" />
		</div>
		<view v-else>
			<wechatH5Login />
		</view>
	</div>
</template>

<script>
	import {
		openIdLogin,
		loginCallback
	} from "@/api/connect.js";
	import api from "@/config/api.js";
	import {
		sendMobile,
		smsLogin,
		userLogin,
		register
	} from "@/api/login";
	import {
		sendEmail
	} from "@/api/common";
	import myVerification from "@/components/verification/verification.vue"; //验证码模块
	import uuid from "@/utils/uuid.modified.js"; // uuid
	import verifyCode from "@/components/verify-code/verify-code";
	import {
		getUserInfo
	} from "@/api/members";
	import {
		whetherNavigate
	} from "@/utils/Foundation"; //登录跳转
	import storage from "@/utils/storage.js"; //缓存
	import wechatH5Login from "./wechatH5Login.vue";
	import {
		webConnect
	} from "@/api/connect.js";
	import {
		md5
	} from "@/utils/md5.js";

	export default {
		components: {
			myVerification,
			verifyCode,
			wechatH5Login
		},

		data() {
			return {
				uuid,
				wechatLogin: false, //是否加载微信公众号登录
				flage: false, //是否验证码验证
				codeFlag: true, //验证开关，用于是否展示验证码
				tips: "",
				enableUserPwdBox: false, //帐号密码登录
				current: 0,
				codeColor: "#999", //按钮验证码颜色
				lightColor: this.$lightColor,
				seconds: 60, //默认验证码等待时间
				loginTitleWay: [{
						title: "欢迎注册",
						desc: "登录后更精彩，美好生活即将开始",
					},
					{
						title: "请输入验证码",
						desc: "已经发送验证码至邮箱",
					},
				],
				userData: {
					username: "",
					password: "",
				},
				showBack: false,
				enableFetchCode: false,
				enableUserBtnColor: false,
				enablePrivacy: false, //隐私政策
				mobile: "", //手机号
				code: "", //验证码
				inputStyle: {
					height: "104rpx",
					"border-bottom": "1rpx solid #D8D8D8",
					"letter-spacing": "1rpx",
					"font-size": "40rpx",
					"line-height": "40rpx",
					color: "#333",
				},
				placeholderStyle: "font-size: 32rpx;line-height: 32rpx;color: #999999;",
				
				// 邀请码相关
				inviteCode: "",
				inviteCodeValid: false,
				inviteCodeError: "",
				validInviteCodes: [
					"OK4MOTO",  // 之前的邀请码
					"LJVLP9", "2Z2RWY", "L96HWH", "FGHVKE", "PKZTYN",
					"GV3AXJ", "6PBY6L", "BSA6ND", "B4E7YT", "FHWC3X"
				],
				// 注册相关
				email: "", // 邮箱
				isRegisterMode: true, // 是否为注册模式
				inviteCodeInputStyle: {
					height: "70rpx",
					"border": "2rpx solid #E0E0E0",
					"border-radius": "8rpx",
					"padding": "0 15rpx",
					"letter-spacing": "1rpx",
					"font-size": "28rpx",
					"line-height": "28rpx",
					color: "#333",
				},
				
				loginList: [
					//第三方登录集合 - Google OAuth 2.0 + Apple（预留）
					{
						icon: "google",
						color: "#4285F4",
						title: "Google",
						code: "GOOGLE",
					},
					{
						icon: "apple-fill",
						color: "#000000",
						title: "Apple",
						code: "APPLE",
					},
				],
			};
		},
		onShow() {

			// 只要是app登录的全部清除内容
			// #ifdef APP-PLUS
			storage.setAccessToken("");
			storage.setRefreshToken("");
			storage.setUserInfo({});
			// #endif

			// Google OAuth 将在点击登录按钮时触发
			// 不需要自动检测浏览器类型
		},

		mounted() {
			/**
			 * 条件编译判断当前客户端类型
			 */
			//#ifdef H5
			this.clientType = "H5";
			//#endif

			//#ifdef APP-PLUS
			this.clientType = "APP";
			// Google OAuth 统一使用 Web OAuth 流程
			// 不依赖 uni.getProvider，保持 loginList 为 Google
			//#endif

			// Google OAuth 和 Apple 适用于所有平台（H5, APP, 小程序）
			// 使用统一的 Web OAuth 2.0 流程
			this.methodFilter(["GOOGLE", "APPLE"]);
		},
			watch: {
			current(val) {
				val ? (this.showBack = true) : (this.showBack = false);
			},
			userData: {
				handler(val) {
					if (this.userData.username && this.userData.password) {
						this.enableUserBtnColor = true;
					} else {
						this.enableUserBtnColor = false;
					}
				},
				deep: true,

			},
			mobile: {
				handler(val) {
					if (val.length == 11) {
						this.enableFetchCode = true;
					}
				},
			},
			email: {
				handler(val) {
					// 简单的邮箱格式验证
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (emailRegex.test(val)) {
						this.enableFetchCode = true;
					} else {
						this.enableFetchCode = false;
					}
				},
			},

			async flage(val) {
				if (val) {
					if (this.$refs.uCode.canGetCode) {
						if (this.enableUserPwdBox) {
							this.submitUserLogin();
							return;
							// 执行登录
						} else {
							// 向后端请求验证码
							uni.showLoading({});
							let res = await sendMobile(this.mobile);
							 if (this.$store.state.isShowToast){ uni.hideLoading() };
							// 这里此提示会被this.start()方法中的提示覆盖
							if (res.data.success) {
								this.current = 1;
								this.$refs.uCode.start();
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
								this.flage = false;
								this.$refs.verification.getCode();
							}
						}
					} else {
						!this.enableUserPwdBox ? this.$u.toast("请倒计时结束后再发送") : "";
					}
				} else {
					this.$refs.verification.hide();
				}
			},
		},
		onLoad(options) {
			if (options && options.state) {
				this.stateLogin(options.state);
			}
		},
		methods: {
			//联合信息返回登录
			stateLogin(state) {
				loginCallback(state).then((res) => {
					let data = res.data;
					if (data.success) {
						storage.setAccessToken(data.result.accessToken);
						storage.setRefreshToken(data.result.refreshToken);
						// 登录成功
						uni.showToast({
							title: "登录成功!",
							icon: "none",
						});
						getUserInfo().then((user) => {
							if(user.data.success){
								storage.setUserInfo(user.data.result);
								storage.setHasLogin(true);
							}else {
								setTimeout(() => {
									uni.showToast({
										title: user.data.message,
										icon: "none",
									});
									storage.setAccessToken('');
									storage.setRefreshToken('');
									uni.switchTab({
										url: "/pages/tabbar/user/my",
									});
								}, 500);
							}
						});
						getCurrentPages().length > 1 ?
							uni.navigateBack({
								delta: getCurrentPages().length - 2,
							}) :
							uni.switchTab({
								url: "/pages/tabbar/home/index",
							});
					}
				});
			},
			/** 根据参数显示登录模块 */
			methodFilter(code) {
				let way = [];
				this.loginList.forEach((item) => {
					if (code.length != 0) {
						code.forEach((val) => {
							if (item.code == val) {
								way.push(item);
							}
						});
					} else {
						uni.showToast({
							title: "配置有误请联系管理员",
							duration: 2000,
							icon: "none",
						});
					}
				});
				this.loginList = way;
			},
			//非h5 获取openid
			async nonH5OpenId(item) {
				let _this = this;
				//获取各个openid
				await uni.login({
					provider: item.appcode,
					// #ifdef MP-ALIPAY
					scopes: "auth_user", //支付宝小程序需设置授权类型
					// #endif
					success: function(res) {
						uni.setStorageSync("type", item.code);
						//微信小程序意外的其它方式直接在storage中写入openid
						// #ifndef MP-WEIXIN
						uni.setStorageSync("openid", res.authResult.openid);
						res.authResult.unionId && uni.setStorageSync("unionId", res.authResult.unionId);
						// #endif
					},
					fail(e) {
						uni.showToast({
							title: "第三方登录暂不可用！",
							icon: "none",
							duration: 3000,
						});
					},
					complete(e) {
						//获取用户信息
						uni.getUserInfo({
							provider: item.appcode,
							success: function(infoRes) {
								//写入用户信息
								uni.setStorageSync("nickname", infoRes.userInfo.nickName);
								uni.setStorageSync("avatar", infoRes.userInfo.avatarUrl);
								uni.setStorageSync("unionId", infoRes.userInfo.unionId || infoRes.userInfo.unionid);

								// #ifdef MP-WEIXIN
								//微信小程序获取openid 需要特殊处理 如需获取openid请参考uni-id: https://uniapp.dcloud.net.cn/uniCloud/uni-id
								_this.weixinMPOpenID(res).then((res) => {
									//这里需要先行获得openid，再使用openid登录，小程序登录需要两步，所以这里特殊编译
									_this.goOpenidLogin("WECHAT_MP");
								});
								// #endif

								// #ifndef MP-WEIXIN
								_this.goOpenidLogin("APP");
								//#endif
							},
						});
					},
				});
			},
			//openid 登录
			goOpenidLogin(clientType) {
				// 获取准备好的参数，进行登录系统
				let params = {
					uuid: uni.getStorageSync("openid"), //联合登陆id
					source: uni.getStorageSync("type"), //联合登陆类型
					nickname: uni.getStorageSync("nickname"), // 昵称
					username: uni.getStorageSync("openid"), // 昵称
					avatar: uni.getStorageSync("avatar"), // 头像
					uniAccessToken: uni.getStorageSync("uni_access_token"), //第三方token
					type:this.clientType,
					token:{unionId:"",openId:uni.getStorageSync("openid")}
				};
        		uni.getStorageSync("unionId") ? (params.token.unionId = uni.getStorageSync("unionId")) : delete params.token;

				openIdLogin(params, clientType).then((res) => {
					if (!res.data.success) {
						let errormessage = "第三方登录暂不可用";
						uni.showToast({
							// title: '未绑定第三方账号',
							title: errormessage,
							icon: "none",
							duration: 3000,
						});
						return;
					} else {
						storage.setAccessToken(res.data.result.accessToken);
						storage.setRefreshToken(res.data.result.refreshToken);
						// 登录成功
						uni.showToast({
							title: "第三方登录成功!",
							icon: "none",
						});
						// 执行登录
						getUserInfo().then((user) => {
							if (user.data.success) {
								/**
								 * 个人信息存储到缓存userInfo中
								 */
								storage.setUserInfo(user.data.result);
								storage.setHasLogin(true);
								uni.switchTab({
									url: "/pages/tabbar/home/index",
								});
								/**
								 * 计算出当前router路径
								 * 1.如果跳转的链接为登录页面或跳转的链接为空页面。则会重新跳转到首页
								 * 2.都不满足返回跳转页面
								 */
								if (user.data.result.mobile) {
									whetherNavigate();
								} else {
									uni.navigateTo({
										url: "/pages/passport/bindUserPhone",
									});
								}
							} else {
								setTimeout(() => {
									uni.showToast({
										title: user.data.message,
										icon: "none",
									});
									storage.setAccessToken('');
									storage.setRefreshToken('');
									uni.switchTab({
										url: "/pages/tabbar/user/my",
									});
								}, 500);
							}
						});
					}
				});
			},
			//微信小程序获取openid
			async weixinMPOpenID(res) {
				await miniProgramLogin(res.code).then((res) => {
					uni.setStorageSync("openid", res.data);
				});
			},
			/**检查邀请码 */
			checkInviteCode() {
				// 实时验证邀请码（不区分大小写）
				const code = this.inviteCode.trim().toUpperCase();
				if (this.validInviteCodes.includes(code)) {
					this.inviteCodeValid = true;
					this.inviteCodeError = "";
				} else if (code.length > 0) {
					this.inviteCodeValid = false;
					this.inviteCodeError = "邀请码错误，请重新输入";
				} else {
					this.inviteCodeValid = false;
					this.inviteCodeError = "";
				}
			},
			
			/**跳转到登录页面 - Google OAuth 2.0 + Apple（预留）*/
			navigateLogin(connectLogin) {
				// 1. 检查邀请码
				if (!this.inviteCodeValid) {
					uni.showToast({
						title: "请先输入正确的邀请码",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				// 2. 检查隐私协议
				if (!this.enablePrivacy) {
					uni.showToast({
						title: "请先同意用户隐私协议",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				// 3. 如果是 Apple 登录，提示暂未开放
				if (connectLogin.code === 'APPLE') {
					uni.showToast({
						title: "Apple 登录即将开放，敬请期待",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				// Google OAuth 统一使用 Web OAuth 流程
				// #ifdef H5
				const oauthCode = connectLogin.code;
				const oauthBuyer = api.buyer;
				window.open(
					oauthBuyer + `/passport/connect/connect/login/web/` + oauthCode,
					"_self"
				);
				// #endif
				
				// #ifdef APP-PLUS
				// APP 端也使用 Web OAuth 流程，通过 WebView 打开
				const oauthCode = connectLogin.code;
				const oauthBuyer = api.buyer;
				const url = oauthBuyer + `/passport/connect/connect/login/web/` + oauthCode;
				
				// 使用内置浏览器打开 OAuth 授权页面
				plus.runtime.openURL(url, function(res) {
					console.log('OAuth opened:', res);
				}, function(e) {
					uni.showToast({
						title: "无法打开登录页面",
						duration: 2000,
						icon: "none",
					});
				});
				// #endif

				// #ifdef MP
				// 小程序端使用 Web View 组件或提示用户在浏览器中登录
				uni.showToast({
					title: "请在浏览器中使用Google登录",
					duration: 3000,
					icon: "none",
				});
				// #endif
			},

			// 提交
			submit() {
				/**
				 * 清空当前账号信息
				 */
				storage.setHasLogin(false);
				storage.setAccessToken("");
				storage.setRefreshToken("");
				storage.setUserInfo({});
				/**
				 * 执行登录
				 */
				smsLogin({
					mobile: this.mobile,
					code: this.code
				}, this.clientType).then(
					(res) => {
						this.getUserInfoMethods(res);
					}
				);
			},

			// 登录成功之后获取用户信息
			getUserInfoMethods(res) {
				if (res.data.success) {
					storage.setAccessToken(res.data.result.accessToken);
					storage.setRefreshToken(res.data.result.refreshToken);

					/**
					 * 登录成功后获取个人信息
					 */
					getUserInfo().then((user) => {
						if (user.data.success) {
							/**
							 * 个人信息存储到缓存userInfo中
							 */
							storage.setUserInfo(user.data.result);
							storage.setHasLogin(true);
							storage.setAutoCp(0)
							// 登录成功
							uni.showToast({
								title:"提示",
								content: "登录成功!",
								icon: "none",
							});


							whetherNavigate();
						}else{
							setTimeout(() => {
								uni.showToast({
									title: user.data.message,
									icon: "none",
								});
								storage.setAccessToken('');
								storage.setRefreshToken('');
								uni.switchTab({
									url: "/pages/tabbar/user/my",
								});
							}, 500);

						}
					});
				}
			},

			// 验证码验证
			verification(val) {
				this.flage = val == this.$store.state.verificationKey ? true : false;
			},
			// 跳转
			navigateToPrivacy(val) {
				uni.navigateTo({
					url: "/pages/mine/help/tips?type=" + val,
				});

			},

			// 点击获取验证码
			start() {
				this.codeColor = "#999";
				this.$u.toast("验证码已发送");
				this.flage = false;
				this.codeFlag = false;

				this.$refs.verification.hide();
			},
			/**点击验证码*/
			codeChange(text) {
				this.tips = text;
			},
			/** 结束验证码后执行 */
			end() {
				this.codeColor = this.lightColor;
				this.codeFlag = true;
				console.log(this.codeColor);
			},

			passwordLogin() {
				if (!this.enablePrivacy) {
					uni.showToast({
						title: "请同意用户隐私",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.userData.username) {
					uni.showToast({
						title: "请填写用户名",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.userData.password) {
					uni.showToast({
						title: "请填写密码",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.flage) {
					this.$refs.verification.error(); //发送

					return false;
				}
			},

			// 提交用户登录
			async submitUserLogin() {
				const params = JSON.parse(JSON.stringify(this.userData));
				params.password = md5(params.password);
				try {
					let res = await userLogin(params,this.clientType);
					if (res.data.success) {
						this.getUserInfoMethods(res);
					} else {
						this.$refs.verification.getCode();
						this.flage = false;
					}
				} catch (error) {
					this.$refs.verification.getCode();
				}
			},

			// 发送验证码
			fetchCode() {
				// 1. 检查邀请码（注册需要邀请码）
				if (!this.inviteCodeValid) {
					uni.showToast({
						title: "请先输入正确的邀请码",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				// 2. 检查隐私协议
				if (!this.enablePrivacy) {
					uni.showToast({
						title: "请同意用户隐私",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				// 3. 注册模式：检查邮箱格式
				if (this.isRegisterMode) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(this.email)) {
						uni.showToast({
							title: "请填写正确邮箱地址",
							duration: 2000,
							icon: "none",
						});
						return false;
					}
					
					// 发送邮箱验证码
					uni.showLoading({
						title: "发送中...",
					});
					sendEmail(this.email, 'REGISTER').then((res) => {
						uni.hideLoading();
						if (res.data.success) {
							this.current = 1;
							this.$refs.uCode.start();
							uni.showToast({
								title: "验证码已发送至邮箱",
								duration: 2000,
								icon: "none",
							});
						} else {
							uni.showToast({
								title: res.data.message || "发送失败，请稍后重试",
								duration: 2000,
								icon: "none",
							});
						}
					}).catch((err) => {
						uni.hideLoading();
						uni.showToast({
							title: "发送失败，请稍后重试",
							duration: 2000,
							icon: "none",
						});
					});
					return;
				}

				// 登录模式：检查手机号格式
				if (!this.$u.test.mobile(this.mobile)) {
					uni.showToast({
						title: "请填写正确手机号",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (this.tips == "重新获取验证码") {
					uni.showLoading({
						title: "加载中",
					});
					if (!this.codeFlag) {
						let timer = setInterval(() => {
							if (this.$refs.verification) {
								this.$refs.verification.error(); //发送
							}
							clearInterval(timer);
						}, 100);
					}
					 if (this.$store.state.isShowToast){ uni.hideLoading() };
				}
				if (!this.flage) {
					this.$refs.verification.error(); //发送

					return false;
				}
			},
			
			// 注册提交
			async submitRegister() {
				if (!this.inviteCodeValid) {
					uni.showToast({
						title: "请先输入正确的邀请码",
						duration: 2000,
						icon: "none",
					});
					return;
				}
				
				if (!this.code || this.code.length !== 6) {
					uni.showToast({
						title: "请输入6位验证码",
						duration: 2000,
						icon: "none",
					});
					return;
				}
				
				if (!this.email) {
					uni.showToast({
						title: "请填写邮箱地址",
						duration: 2000,
						icon: "none",
					});
					return;
				}
				
				// 调用注册API
				uni.showLoading({
					title: "注册中...",
				});
				
				try {
					// 生成默认用户名（使用邮箱前缀）
					const username = this.email.split('@')[0] || this.email;
					
					const params = {
						email: this.email,
						code: this.code,
						password: this.userData.password || '123456', // 默认密码，实际应该让用户输入
						username: username
					};
					
					const res = await register(params, this.clientType);
					uni.hideLoading();
					
					if (res.data.success) {
						uni.showToast({
							title: "注册成功！",
							duration: 2000,
							icon: "success",
						});
						
						// 注册成功后自动登录
						setTimeout(() => {
							// 跳转到登录页面或自动登录
							uni.switchTab({
								url: "/pages/tabbar/home/index",
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.data.message || "注册失败，请稍后重试",
							duration: 2000,
							icon: "none",
						});
					}
				} catch (error) {
					uni.hideLoading();
					uni.showToast({
						title: "注册失败，请稍后重试",
						duration: 2000,
						icon: "none",
					});
				}
			},
		},
	};
</script>
<style>
	page {
		background: #fff;
	}
</style>
<style lang="scss" scoped>
	.wrapper {
		padding: 0 80rpx;
	}

	.title {
		padding-top: calc(40rpx);
		font-style: normal;
		line-height: 1;
		font-weight: 500;
		font-size: 48rpx;
		color: #333;
	}

	.box-code {
		margin-top: 40rpx;
	}

	.desc,
	.desc-light {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #333333;
		margin-top: 20rpx;
	}

	.desc {
		color: #333;
	}

	.desc-light {
		color: #999999;

		>span {
			color: #333;
			margin-left: 8rpx;
		}
	}

	.mobile {
		margin-top: 20rpx;
	}

	.disable {
		background: linear-gradient(90deg, #ffdcba 2.21%, #ffcfb2 99.86%);
	}

	.fetch {
		background: linear-gradient(57.72deg, #ff8a19 18.14%, #ff5e00 98.44%);
	}

	.btn {
		border-radius: 100px;
		width: 590rpx;
		margin-top: 30rpx;
		height: 80rpx;
		font-size: 30rpx;
		line-height: 80rpx;
		text-align: center;
		color: #ffffff;
	}

	.tips {
		font-size: 11px;
		line-height: 18px;
		margin-top: 20rpx;
		width: 546rpx;

		>span {
			color: $light-color;
		}
	}

	.fetch-btn {
		width: 370rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #f2f2f2;
		border-radius: 100rpx;
		font-size: 28rpx;
		color: #999;
		margin: 40rpx auto 0 auto;
	}

	/* 邀请码相关样式 - 紧凑版 */
	.invite-code-section-top {
		width: 590rpx;
		margin: 30rpx auto 20rpx;
		padding: 15rpx;
		background: #f8f9fa;
		border-radius: 8rpx;
		border: 2rpx dashed #ff8a19;
	}

	.invite-code-title-small {
		font-size: 24rpx;
		color: #ff8a19;
		font-weight: 500;
		margin-bottom: 10rpx;
		text-align: center;
	}
	
	.invite-code-section {
		width: 590rpx;
		margin: 20rpx auto 15rpx;
		padding: 15rpx;
		background: #f8f9fa;
		border-radius: 8rpx;
		border: 2rpx dashed #ff8a19;
	}

	.invite-code-title {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 10rpx;
		text-align: center;
	}

	.invite-code-input {
		width: 100%;
	}

	.invite-code-error {
		color: #ff5e00;
		font-size: 22rpx;
		margin-top: 8rpx;
		text-align: center;
	}

	.invite-code-success {
		color: #4caf50;
		font-size: 22rpx;
		margin-top: 8rpx;
		text-align: center;
		font-weight: 500;
	}

	.login-list {
		display: flex;
		width: 590rpx;
		margin: 15rpx auto;
		align-items: center;
		justify-content: center;
		gap: 40rpx;
	}
	
	.login-list-tip {
		width: 590rpx;
		margin: 10rpx auto;
		text-align: center;
		font-size: 22rpx;
		color: #999;
	}

	.login-item {
		width: 70rpx;
		border-radius: 10rpx;
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 15rpx;
	}

	/* 分隔线样式 */
	.section-divider {
		display: flex;
		align-items: center;
		width: 590rpx;
		margin: 20rpx auto 15rpx;
	}

	.divider-line {
		flex: 1;
		height: 1rpx;
		background: #e0e0e0;
	}

	.divider-text {
		padding: 0 15rpx;
		font-size: 24rpx;
		color: #999;
	}

	/* 第三方登录区域 */
	.third-party-section {
		margin: 15rpx 0;
	}

	/* 底部区域 */
	.bottom-section {
		margin: 15rpx 0;
		text-align: center;
	}

	/* 隐私协议区域 */
	.privacy-section {
		margin-top: 20rpx;
		padding-top: 15rpx;
		border-top: 1rpx solid #f0f0f0;
		width: 590rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.user-password-tips {
		text-align: center;
		color: $main-color;
		padding: 15rpx 30rpx;
		margin: 0 auto;
		font-size: 28rpx;
		border: 1rpx solid #ff5e00;
		border-radius: 50rpx;
		width: fit-content;
		display: inline-flex;
		align-items: center;
	}
	
	/* 手机号注册提示 */
	.mobile-register-hint {
		margin-top: 20rpx;
		padding: 15rpx 20rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #999;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
