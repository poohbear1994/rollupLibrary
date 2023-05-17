type StorageValueType = string | number | object | boolean

/**
 * @description: 获取 localStorage 的 key
 * @param {string} key
 */
export function getLocalStorage(key: string): any {
	let val = localStorage.getItem(key)
	if (val) {
		try {
			val = JSON.parse(val)
			return val
		} catch (error) {
			return val
		}
	}
	return ''
}

/**
 * @description: 设置 localStorage 的 key
 * @param {string} key
 * @param {StorageValueType} val
 */
export function setLocalStorage(key: string, val: StorageValueType) {
	return localStorage.setItem(key, JSON.stringify(val))
}

/**
 * @description: 删除 localStorage 的 key
 * @param {string} key
 */
export function removeLocalStorage(key: string) {
	return localStorage.removeItem(key)
}
