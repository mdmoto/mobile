<template>
	<view class="box">
		<view class="box-tips">
			<h2 class='h2'>
				{{verificationTitle.title}}
			</h2>
			<view class="verification">{{verificationTitle.desc}}</view>
		</view>
		<view class="form">
			<u-form :model="codeForm" ref="validateCodeForm">
				<u-form-item label-width="120" label="旧密码">
						<u-input type="password" v-model="oldPassword" placeholder="请输入您的旧密码" />
					</u-form-item>

					<u-form-item label-width="120" label="密码">
						<u-input type="password" v-model="password" placeholder="请输入您的密码" />
					</u-form-item>

					<u-form-item label-width="120" label="确认密码">
						<u-input type="password" v-model="newPassword" placeholder="请再次输入您的密码" />
					</u-form-item>

					<view class="submit" @click="updatePassword">修改密码</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	import {
		resetByMobile,
		modifyPass
	} from "@/api/login";

	import {
		md5
	} from "@/utils/md5.js"; // md5
	import myVerification from "@/components/verification/verification.vue"; //验证
	import uuid from "@/utils/uuid.modified.js";
	export default {
		components: {
			myVerification,
		},
		data() {
			return {
				uuid,
				validateFlage: false, //是否进行了手机号验证
				verificationTitle: {
					title: "修改密码",
					desc: "请验证并输入密码",
				},
				step: 0, //当前验证步骤
				flage: false, //是否验证码验证

				codeForm: {
					mobile: "", //手机号
					code: "", //验证码
				},
				newPassword: "", //新密码
				password: "", //密码
				oldPassword: '', //旧密码
				tips: "", //提示
				seconds: 69, // 60s等待时间

				// 验证码登录校验
				codeRules: {
					mobile: [{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						trigger: ["blur"],
					}, ],
					code: [{
						min: 4,
						max: 6,
						required: true,
						message: "请输入验证码",
						trigger: ["blur"],
					}, ],
				},
			};
		},
		onReady() {
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			this.$refs.validateCodeForm.setRules(this.codeRules);
		},

		methods: {
			// 修改密码
			updatePassword() {
				if(this.password !== this.newPassword){
					uni.showToast({
						title: "两次输入密码不一致!",
						icon: "none",
					});
					return;
				}
				modifyPass({
					password: md5(this.oldPassword),
					newPassword: md5(this.newPassword),
				}).then((res) => {
					if (res.data.success) {
						uni.showToast({
							title: "修改成功!",
							duration: 2000,
							icon: "none",
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							});
						}, 1000);
					}
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import url("@/pages/passport/login.scss");

	::v-deep  .u-form-item {
		margin: 40rpx 0;
	}

	.sendCode {
		::v-deep  .u-form-item--right__content__slot {
			display: flex;
		}
	}

	.h2 {
		font-size: 40rpx;
		font-weight: bold;
	}

	page {
		background: #fff;
	}

	.box {
		padding: 80rpx 0;
		border-radius: 20rpx;
	}

	.submit {
		background: $light-color;
	}

	.box-tips {
		margin: 0 72rpx;
	}

	.verification {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
</style>
