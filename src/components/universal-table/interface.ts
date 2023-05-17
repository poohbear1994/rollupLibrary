type FilterType =
	| 'filter-string'
	| 'filter-list'
	| 'filter-list-multi'
	| 'filter-date-pick-datetimerange'
	| 'filter-date-pick-daterange'
	| 'filter-date-pick-year'
	| 'filter-date-pick-month'
	| 'filter-date-pick-date'
	| 'filter-date-pick-datetime'
	| 'filter-date-pick-week'
	| 'filter-cascader'
	| 'filter-list-multi-search'

export interface FilterInterface {
	type: FilterType
	field: string
	fieldName?: string
	option?: any
	select?: any
	sort?: boolean | string
}

export interface MultiListInterface {
	value: number | string
	label: string
}

export interface IFilterConfirmInterface {
	field: string
	value: any
	label?: any[]
	text?: any
}

export type DateTimePickType =
	| 'year'
	| 'month'
	| 'date'
	| 'datetime'
	| 'week'
	| 'datetimerange'
	| 'daterange'
	| undefined

export interface ColumnInterface {
	propName: string
	headerName: string
	value: 'default' | 'timestampToTime' | 'custom'
	filter?: FilterInterface
	minWidth?: string
	width?: string
	permission?: string | string[]
	fixed?: 'left' | 'right'
	sortable?: boolean | string
	disabledCheckbox?: boolean // 是否禁用复选框让用户不可取消勾选列显示，默认规则：取消勾选后的最后一列禁用
	sortMethod?: () => void // 表格排序方法
	sortChangeFunction?: () => void // 监听表格排序改变
}

export interface PageQueryInterface {
	current: number
	size: number
	descs?: string
	ascs?: string
}

// 表格设置项
export interface TableOptions {
	needFilterTag?: boolean // 是否需要过滤标签
	needPaginations?: boolean // 是否需要分页器
	needDynamicColumns?: boolean // 是否需要动态列设置
	selectMode?: 'single-select' | 'multiple-select' | false // 是否开启多选
	selectReserve?: boolean // 是否记住选中项（仅多选时有效）
	allSelectBtnDisable?: boolean // 是否禁用全选按钮
	rowKey?: string // 属性节点key
	defaultExpandAll?: boolean // 是否默认展开树形表格
	selectBoxAbleFunction?: () => void // 是否可以选择
	// eslint-disable-next-line
	selectFilterFunction?: (rows: any[], row: any) => boolean // 多选时是否可以多选
}
