<script>
	/**
	 * vuex管理登录状态，具体可以参考官方登录模板示例
	 */
	import config from "@/config/config";
import {
	getClipboardData
} from "@/js_sdk/h5-copy/h5-copy.js";
import APPUpdate from "@/plugins/APPUpdate";
import storage from "@/utils/storage";
import {
	mapMutations
} from "vuex";
import { getMaoMallRates } from "@/api/maomall";

	
	
	/**
	 * 路由监听并删除路由
	 * https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
	 * */
	// #ifdef MP-WEIXIN
	wx.onAppRoute((res) => {
		
	})
	// #endif

	export default {
		data() {
			return {
				config,
			};
		},

		/**
		 * 监听返回
		 */
		onBackPress(e) {
			if (e.from == "backbutton") {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: "/pages/tabbar/home/index"
					});
				}
				return true;
			}
		},
		onLaunch: function(val) {
			console.log("App Launch", val);
			if(val.query.inviter){
				storage.setInviter(val.query.inviter)
			}

      // #ifdef APP-PLUS
			// 重点是以下： 一定要监听后台恢复 ！一定要
			plus.globalEvent.addEventListener("newintent", (e) => {
				this.checkArguments(); // 检测启动参数
			});
			// #endif

			// #ifdef MP-WEIXIN
			this.applyUpdateWeChat();
			// #endif
			
			this.initMaoMallRates();
		},

		onShow() {
			// #ifndef H5
			if(this.config.enableGetClipboard){
				this.getClipboard();
			}
			// #endif
			// #ifdef APP-PLUS

			if (storage.getShow()) {
				if (uni.getSystemInfoSync().platform == 'ios') {
					uni.$u.route("/pages/tabbar/screen/fullScreen");
				}
			}
			// #endif
		},
		methods: {
			...mapMutations(["login"]),
			async initMaoMallRates() {
				try {
					const result = await getMaoMallRates();
					storage.setExchangeRates(result);
					console.log("MaoMall rates updated:", result);
				} catch (e) {
					console.error("Failed to fetch MaoMall rates", e);
				}
			},
			/**
			 * 微信小程序版本提交更新版本 解决缓存问题
			 */
			applyUpdateWeChat() {
				const updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
				});

				updateManager.onUpdateReady(function(res) {
					uni.showModal({
						title: "更新提示",
						content: "发现新版本，是否重启应用？",
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						},
					});
				});
				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
				});
			},

			//  TODO 开屏广告 后续优化添加
			launch() {
				try {
					// 获取本地存储中launchFlag标识 开屏广告
					const value = uni.getStorageSync("launchFlag");
					if (!value) {
						// uni.$u.route("/pages/index/agreement");
					} else {
						//app启动时打开启动广告页
						var w = plus.webview.open(
							"/hybrid/html/advertise/advertise.html",
							"本地地址", {
								top: 0,
								bottom: 0,
								zindex: 999,
							},
							"fade-in",
							500
						);
						//设置定时器，4s后关闭启动广告页
						setTimeout(function() {
							plus.webview.close(w);
							APPUpdate();
						}, 3000);
					}
				} catch (e) {
					// error
					uni.setStorage({
						key: "launchFlag",
						data: true,
						success: function() {
							console.log("error时存储launchFlag");
						},
					});
				}
			},

			/**
			 * 获取粘贴板数据
			 */
			async getClipboard() {
				let res = await getClipboardData();

				/**
				 * 解析粘贴板数据
				 */

				if (res && res.indexOf(config.shareLink) != -1 && (res != this.$store.state.shareLink)) {
					this.$store.state.shareLink = res
					uni.showModal({
						title: "提示",
						content: "检测到一个分享链接是否跳转？",
						confirmText: "跳转",
						success: function(callback) {
							if (callback.confirm) {
								const path = res.split(config.shareLink)[1];
								if (path.indexOf("tabbar") != -1) {
									uni.switchTab({
										url: path,
									});
								} else {
									uni.navigateTo({
										url: path,
									});
								}
							}
						},
					});
				}
			},

			/**
			 * h5中打开app获取跳转app的链接并跳转
			 */
			checkArguments() {
				// #ifdef APP-PLUS
				setTimeout(() => {
					const args = plus.runtime.arguments;
					if (args) {
						const argsStr = decodeURIComponent(args);
						const path = argsStr.split("//")[1];
						if (path.indexOf("tabbar") != -1) {
							uni.switchTab({
								url: `/${path}`,
							});
						} else {
							uni.navigateTo({
								url: `/${path}`,
							});
						}
					}
				});
				// #endif
			},
		},
	};
</script>

<style lang="scss">
	@import "uview-plus/index.scss";

	// -------适配底部安全区  苹果x系列刘海屏

	// #ifdef MP-WEIXIN
	.mp-iphonex-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
		height: auto !important;
		padding-top: 10rpx;
	}

	// #endif

	body {
		background-color: $bg-color;
	}

	/************************ */
	.w200 {
		width: 200rpx !important;
	}

	.flex1 {
		flex: 1; //必须父级设置flex
	}

  /* 9-Language RTL Mobile Layout Handling */
  .rtl-container {
    direction: rtl;
    text-align: right;

    // Reverse flex layouts
    .u-flex, .flex, [style*="display: flex"] {
      flex-direction: row-reverse !important;
    }

    // Mirror standard arrow icons
    .u-icon__icon.u-icon-right, .u-icon__icon.u-icon-arrow-right, .u-icon__icon.u-icon-arrow-left-double {
      transform: scaleX(-1);
    }

    // Specific uView component fixes
    .u-tabs .u-scroll-box {
      direction: ltr; // Fix scrollable tabs jumping
    }

    // Dynamic Margin/Padding Swapping (Basic set)
    @for $i from 0 through 80 {
      @if $i % 2 == 0 or $i % 5 == 0 {
        .u-m-l-#{$i}, .u-margin-left-#{$i} { margin-left: 0 !important; margin-right: $i + rpx !important; }
        .u-m-r-#{$i}, .u-margin-right-#{$i} { margin-right: 0 !important; margin-left: $i + rpx !important; }
        .u-p-l-#{$i}, .u-padding-left-#{$i} { padding-left: 0 !important; padding-right: $i + rpx !important; }
        .u-p-r-#{$i}, .u-padding-right-#{$i} { padding-right: 0 !important; padding-left: $i + rpx !important; }
      }
    }

    .u-row-left { justify-content: flex-end !important; }
    .u-row-right { justify-content: flex-start !important; }
    .u-text-left { text-align: right !important; }
    .u-text-right { text-align: left !important; }

    .u-cell__left-icon-wrap {
      margin-left: 20rpx;
      margin-right: 0 !important;
    }
  }
</style>
