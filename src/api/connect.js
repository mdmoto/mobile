/**
 * 信任登录相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * web 第三方登录
 */
export async function webConnect(code) {
	return request({
		url: `passport/connect/connect/login/web/${code}`,
		method: Method.GET,
		needToken: true,
		header: {
			"clientType": "H5"
		}
	});
}

/**
 * Google OAuth 登录
 */
export async function googleLogin() {
	return request({
		url: `passport/connect/connect/login/web/GOOGLE`,
		method: Method.GET,
		needToken: true,
		header: {
			"clientType": "H5"
		}
	});
}

/**
 * App OpenID 登录
 */
export async function openIdLogin(params, clientType) {
	return request({
		url: `passport/connect/connect/app/login`,
		method: Method.POST,
		needToken: true,
		data: params,
		header: {
			"clientType": clientType
		}
	});
}

/**
 * 第三方登录成功回调
 */
export async function loginCallback(state) {
	return request({
		url: `passport/connect/connect/result?state=${state}`,
		method: Method.GET,
		needToken: false
	});
}

/**
 * 小程序自动登录
 */
export async function mpAutoLogin(params) {
	return request({
		url: 'passport/connect/miniProgram/auto-login',
		method: Method.GET,
		params
	});
}
