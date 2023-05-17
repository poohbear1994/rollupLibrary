import { dayjs } from 'element-plus'

/**
 * @description: 时间转为时间戳
 * @param {string} str 时间字符串
 */
export const timeToTimestamp = (str: string) => {
	return Date.parse(str)
}

/**
 * @description: 时间戳转为时间
 * @param {string} date
 */
export const timestampToTime = (date?: string | number | Date | dayjs.Dayjs | null | undefined) => {
	if (date) {
		return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
	} else {
		return ''
	}
}
