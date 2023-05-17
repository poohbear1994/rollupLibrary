import { getLocalStorage } from './storage'

interface IBinding {
	value: string[] | string
}

/**
 * @description: 权限指令检查
 * @param {any} el
 * @param {IBinding} binding
 */
function checkPermission(el: any, binding: IBinding): void {
	const { value } = binding
	if (Array.isArray(value)) {
		checkArrayMethod(el, value)
	}
	if (typeof value === 'string') {
		checkMethod(el, value)
	}
}

/**
 * @description: 检查多项权限
 * @param {any} el
 * @param {Array} wfvArr 待验证权限列表
 * @return {*}
 */
function checkArrayMethod(el: any, wfvArr: Array<string>): void {
	const permission = getLocalStorage('permission')
	const hasPermission = wfvArr.some(p => permission && permission.includes(p))
	if (!hasPermission) el.parentNode && el.parentNode.removeChild(el)
}

/**
 * @description: 检查方法
 * @param {any} el
 * @param {string} value
 */
function checkMethod(el: any, value: string): void {
	if (value) {
		// 匹配对应的指令
		const permission = getLocalStorage('permission')
		const hasPermission = permission && permission.includes(value)
		// 如果无法匹配，则表示当前用户无该指令，那么删除对应的功能按钮
		if (!hasPermission) {
			el.parentNode && el.parentNode.removeChild(el)
		}
	} else {
		// eslint-disabled-next-line
		throw new Error('v-permission error')
	}
}

/**
 * @description: 安装权限校验指令
 * @param {any} app 应用
 */
export default (app: any) => {
	app.directive('permission', {
		// 在绑定元素的父组件被挂载后调用
		mounted(el: any, binding: any) {
			checkPermission(el, binding)
		},
		// 在包含组件的 VNode 及其子组件的 VNode 更新后调用
		update(el: any, binding: any) {
			checkPermission(el, binding)
		},
	})
}
