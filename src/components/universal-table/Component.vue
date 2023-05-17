<template>
	<div class="universal-table-container">
		<CollapseTagList
			v-if="latestTableOptions.needFilterTag"
			:data="filterList"
			:format-tag="getFilterTag"
			@close-tag="handleCloseTag"
			@clear-tag="handleAllClear"
		/>
		<div class="main-container">
			<div
				class="table-wrap"
				:class="latestTableOptions.allSelectBtnDisable ? 'disable-all-selected' : ''"
			>
				<el-table
					ref="tableRef"
					v-loading="loading"
					empty-text="暂无数据"
					height="100%"
					:indent="24"
					:data="dataSource"
					:header-cell-class-name="allSelectBtnDisable"
					:border="true"
					:row-key="latestTableOptions.rowKey"
					:default-expand-all="latestTableOptions.defaultExpandAll"
					@sort-change="sortChangeFunction"
					@select="handleSelect"
					@select-all="handleSelect"
				>
					<el-table-column
						v-if="latestTableOptions.selectMode"
						:selectable="latestTableOptions.selectBoxAbleFunction"
						:reserve-selection="latestTableOptions.selectReserve"
						type="selection"
						width="55"
					/>
					<template v-for="column in showColumns" :key="column.propName">
						<el-table-column
							v-permission="column.permission"
							:show-overflow-tooltip="true"
							:prop="column.propName"
							:min-width="column.minWidth || ''"
							:width="column.width || ''"
							:sortable="column.sortable"
							:sort-method="column.sortMethod"
							:fixed="column.fixed"
						>
							<template #header>
								<div class="table-header">
									<div class="table-header-title">{{ column.headerName }}</div>
									<div v-if="column.filter" class="table-header-filter">
										<filter-string
											v-if="column.filter.type === 'filter-string'"
											:field="column.filter.field"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></filter-string>
										<filter-list-multi
											v-if="column.filter.type === 'filter-list-multi'"
											:field="column.filter.field"
											:data-source="column.filter.option"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></filter-list-multi>
										<FilterListMultiSearch
											v-if="column.filter.type === 'filter-list-multi-search'"
											:field="column.filter.field"
											:data-source="column.filter.option"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></FilterListMultiSearch>
										<filter-list
											v-if="column.filter.type === 'filter-list'"
											:field="column.filter.field"
											:data-source="column.filter.option"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></filter-list>
										<filter-cascader
											v-if="column.filter.type === 'filter-cascader'"
											:field="column.filter.field"
											:select-data="column.filter.option"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></filter-cascader>
										<filter-date-pick
											v-if="isFilterDatePick(column.filter.type)"
											:type="getDateTimePickType(column.filter.type)"
											:field="column.filter.field"
											:is-active="filterActive[column.filter.field]"
											@confirm="filterConfirm($event, column.filter!.type)"
											@clear="filterClear"
										></filter-date-pick>
									</div>
								</div>
							</template>
							<template #default="scope">
								<div v-if="column.value === 'default'" class="one-line-ellipsis">
									{{ _.unescape(scope.row[column.propName]) || '--' }}
								</div>
								<div v-if="column.value === 'timestampToTime'" class="one-line-ellipsis">
									{{ _.unescape(timestampToTime(scope.row[column.propName])) || '--' }}
								</div>
								<div v-if="column.value === 'custom'" class="one-line-ellipsis">
									<slot :name="column.propName" :scope="scope"></slot>
								</div>
							</template>
						</el-table-column>
					</template>
				</el-table>
			</div>
			<div v-if="latestTableOptions.needDynamicColumns" class="dynamic-columns-container">
				<DynamicColumns
					:data-source="columns"
					:init-checked-columns="initColumnsForPropName"
					@checked-columns-change="checkedColumnsChangeMethod"
				></DynamicColumns>
			</div>
			<div
				v-if="latestTableOptions.needDynamicColumns || latestTableOptions.needPaginations"
				class="pagination-wrap"
			>
				<el-pagination
					v-model:currentPage="pageQuery.current"
					v-model:page-size="pageQuery.size"
					:small="true"
					:page-sizes="[20, 50, 100]"
					:disabled="false"
					:background="true"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					@size-change="chagePageQuery"
					@current-change="chagePageQuery"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref } from 'vue'
import DynamicColumns from './DynamicColumns.vue'
import FilterCascader from '../filter-cascader/Component.vue'
import FilterDatePick from '../filter-date-pick/Component.vue'
import FilterList from '../filter-list/Component.vue'
import FilterListMulti from '../filter-list-multi/Component.vue'
import FilterString from '../filter-string/Component.vue'
import CollapseTagList from '../collapse-tag-list/Component.vue'
import type { ElTable } from 'element-plus'
import {
	ColumnInterface,
	MultiListInterface,
	IFilterConfirmInterface,
	DateTimePickType,
	PageQueryInterface,
	TableOptions,
} from './interface'
import _ from 'lodash'
import { timestampToTime, timeToTimestamp } from './utils'

const props = defineProps({
	tableOptions: {
		type: Object as PropType<TableOptions>,
		default: () => ({
			needDynamicColumns: true,
			needFilterTag: true,
			needPaginations: true,
			allSelectBtnDisable: false,
			selectMode: false,
			selectReserve: false,
			rowKey: '',
			defaultExpandAll: false,
			selectBoxAbleFunction: function (row: any, index: number): boolean {
				if (index / 2) {
					return true
				}
				return false
			},
		}),
	},
	columns: {
		type: Object as PropType<ColumnInterface[]>,
		required: true,
	},
	initColumnsForPropName: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	dataSource: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	total: {
		type: Number,
		default: 0,
	},
	filterList: {
		type: Object as PropType<{ [key: string]: any }>,
		default: () => ({}),
	},
	pageQuery: {
		type: Object as PropType<PageQueryInterface>,
		default: () => ({
			current: 1,
			size: 20,
		}),
	},
})

const specialFilterTags: { [key: string]: string } = {}

// // 接收方法，勾选改变事件
const emits = defineEmits(['update:filterList', 'update:pageQuery', 'handleSelectedChange'])

// ---------------------------------------------------------------------- 数据源 -----------------------------------------------------------------
const showColumns = ref<ColumnInterface[]>(props.columns)
const tableRef = ref<InstanceType<typeof ElTable>>()
const pageQuery = reactive<PageQueryInterface>({
	...props.pageQuery,
})
// 当前选中行
const selectedRows = ref<any[]>([])
// 表格配置项合并
const latestTableOptions = computed(() => {
	return {
		needDynamicColumns: true,
		needFilterTag: true,
		needPaginations: true,
		allSelectBtnDisable: false,
		selectMode: false,
		selectReserve: false,
		rowKey: '',
		defaultExpandAll: false,
		...props.tableOptions,
	}
})

/**
 * @description: 更改pageQuery
 * @param {*}
 * @return {*}
 */
function chagePageQuery(): void {
	emits('update:pageQuery', pageQuery)
}

// ---------------------------------------------------------------------- 数据源切换 -----------------------------------------------------------

/**
 * @description: 设置选中行
 * @param {*} rows 设置有哪些选中行
 * @return {*}
 */
function setSelectedRows(rows: any[]): void {
	selectedRows.value = rows
}

/**
 * @description: 勾选需要展示的列时
 * @param {*} checkedColumns
 * @return {*}
 */
function checkedColumnsChangeMethod(checkedColumns: ColumnInterface[]): void {
	showColumns.value = checkedColumns
}

// // ---------------------------------------------------------------------- 过滤器处理 -----------------------------------------------------------

// 时间类型过滤器
const filterDatePickTypeArray: string[] = [
	'filter-date-pick-datetimerange',
	'filter-date-pick-daterange',
	'filter-date-pick-year',
	'filter-date-pick-month',
	'filter-date-pick-date',
	'filter-date-pick-datetime',
	'filter-date-pick-week',
]
// 动态生成过滤器激活flag
const filterActive = reactive<{ [key: string]: any }>({ ...props.filterList })
props.columns.forEach(item => {
	item.filter && (filterActive[item.filter.field] = false)
})
const filterListData = reactive<{ [key: string]: any }>({})

/**
 * @description: 过滤确认
 * @param {IFilterProp} field
 * @return {*}
 * @Date Changed:
 */
function filterConfirm(e: IFilterConfirmInterface, filterType: string): void {
	if (isFilterDatePick(filterType)) {
		if (Array.isArray(e.value)) {
			filterListData[e.field] = e.value.map(item => {
				return timeToTimestamp(item)
			})
		} else {
			filterListData[e.field] = timeToTimestamp(e.value)
		}
	} else if (filterType === 'filter-cascader') {
		specialFilterTags[e.field] = e.text
		filterListData[e.field] = e.value
	} else {
		filterListData[e.field] = e.value
	}
	emits('update:filterList', filterListData)
	filterActive[e.field] = true
}

/**
 * @description: 过滤清除
 * @param {IFilterProp} field
 * @return {*}
 * @Date Changed:
 */
function filterClear({ field }: { field: string | number; value: any }): void {
	handleCloseTag(field)
}

/**
 * @description: 表格排序监听
 * @return {*}
 */
function sortChangeFunction({ prop, order }: { prop: string; order: string }): void {
	// 如果是降序
	if (order === 'descending') {
		delete pageQuery['ascs']
		delete pageQuery['descs']
		pageQuery['descs'] = prop
		chagePageQuery()
		// 如果是升序
	} else if (order === 'ascending') {
		delete pageQuery['ascs']
		delete pageQuery['descs']
		pageQuery['ascs'] = prop
		chagePageQuery()
		// 不排序
	} else if (order === null) {
		delete pageQuery['ascs']
		delete pageQuery['descs']
		chagePageQuery()
	}
}

// ---------------------------------------------------------------------- 过滤tag栏 -----------------------------------------------------------

/**
 * @description: 关闭标签
 * @param {IFilterProp} key
 * @return {*}
 * @Date Changed:
 */
function handleCloseTag(key: string | number): void {
	filterActive[key] = false
	delete filterListData[key]
	emits('update:filterList', filterListData)
}

/**
 * @description: 获取筛选标签
 * @param {string | number} field 过滤字段
 * @param {*} value 过滤值
 * @return {*}
 */
function getFilterTag(field: string | number, value: any): string {
	// 获取该列的设置
	let columnOption = props.columns.filter(item => {
		return item.propName === field
	})[0]
	if (!columnOption) {
		columnOption = props.columns.filter(item => {
			return item.filter?.field === field
		})[0]
	}
	// 获取过滤的字段名
	const keyName = columnOption.filter?.fieldName || columnOption.headerName
	/**
	 * 判断过滤器是否是多选或是日期
	 * 如果过滤器是多选类型
	 */
	if (
		columnOption.filter?.type === 'filter-list-multi' ||
		columnOption.filter?.type === 'filter-list-multi-search'
	) {
		const multiMap: { [key: string | number]: string } = {}
		const multiList: MultiListInterface[] = columnOption.filter.option
		multiList.forEach(item => {
			multiMap[item.value] = item.label
		})
		value = (value as number[]).map(item => {
			return multiMap[item]
		})
	} else if (columnOption.filter?.type === 'filter-list') {
		const multiList: MultiListInterface[] = columnOption.filter.option
		const labelName = multiList.filter(item => item.value === value)
		value = labelName[0].label
	}
	// 处理日期类型
	else if (isFilterDatePick(columnOption.filter!.type)) {
		// 判断是一组时间戳还是一个时间戳
		if (Array.isArray(value)) {
			value = (value as number[]).map(item => {
				return timestampToTime(item)
			})
		} else {
			value = timestampToTime(value)
		}
	} else if (columnOption.filter?.type === 'filter-cascader') {
		value = specialFilterTags[columnOption.propName]
	}
	const str = `${keyName}: ${_.unescape(value)}`
	return str
}

/**
 * @description: 清除所有过滤条件
 * @return {*}
 */
function handleAllClear(): void {
	Object.keys(filterListData).forEach(key => {
		filterActive[key] = false
		delete filterListData[key]
	})
	emits('update:filterList', filterListData)
}

// ------------------------------------------------------------------------ 类型检查方法 -----------------------------------------

/**
 * @description: 检查过滤类型是否是日期选择器类型
 * @param {*} filterType 过滤器类型
 * @return {*}
 */
function isFilterDatePick(filterType: string): boolean {
	if (filterDatePickTypeArray.includes(filterType)) return true
	return false
}

/**
 * @description: 获取日期时间选择器类型
 * @param {*} type
 * @return {*}
 */
function getDateTimePickType(type: string): DateTimePickType {
	const index = type.lastIndexOf('-') + 1
	const pickType = type.substring(index) as DateTimePickType
	return pickType
}

// --------------------------------------------------------------------- element表格原声方法嫁接 -----------------------------------------------

/**
 * @description: 选择项勾选
 * @param {*} selection 当前所有选中项
 * @param {*} row 触发时间的选项
 * @return {*}
 */
function handleSelect(selection: any[], row: any): void {
	// 单选
	if (latestTableOptions.value.selectMode === 'single-select') {
		//  取消选择
		if (selectedRows.value.length > selection.length) {
			setSelectedRows(selection)
			// 非取消选择
		} else {
			tableRef.value?.clearSelection()
			tableRef.value?.toggleRowSelection(row, true)
			setSelectedRows([row])
		}
		emits('handleSelectedChange', selectedRows.value, row)
	}
	// 多选
	if (latestTableOptions.value.selectMode === 'multiple-select') {
		// 需要过滤
		if (
			latestTableOptions.value.selectFilterFunction &&
			!latestTableOptions.value.selectFilterFunction(selection, row)
		) {
			tableRef.value?.toggleRowSelection(row, false)
			selection.pop()
			setSelectedRows(selection)
			emits('handleSelectedChange', selection, row)
		} else {
			// 不需要过滤
			setSelectedRows(selection)
			emits('handleSelectedChange', selection, row)
		}
	}
}

/**
 * @description: 全选禁用
 * @param {*} column
 * @return {*}
 */
function allSelectBtnDisable(column: any): string {
	if (column.columnIndex === 0 && column.rowIndex === 0) {
		return 'disable-head-selection'
	}
	return ''
}

/**
 * 获取当前选中的行数据
 */
function getSelectedRows() {
	return tableRef.value!.getSelectionRows()
}

/**
 * 设置行的选中状态
 * @param id 唯一值（必须是rowKey对应的值）
 * @param selected 是否选中，不传则默认为true选中
 */
function setRowSelected(id: any, selected = true) {
	const idKey = latestTableOptions.value.rowKey
	let row: any
	if (selected) {
		row = { [idKey]: id } //性能优化：若需选中则无需遍历
	} else {
		row = getSelectedRows().find((p: any) => p[idKey] === id)
		if (row == null) return
	}
	tableRef.value!.toggleRowSelection(row, selected)
}

/**
 * 用于多选表格，清空选择
 */
function clearSelected() {
	tableRef.value!.clearSelection()
}

defineExpose({
	filterListData,
	getSelectedRows,
	setRowSelected,
	clearSelected,
	tableRef,
})
</script>

<style lang="scss" scoped>
.disable-all-selected {
	:deep(.disable-head-selection > .cell .el-checkbox__inner) {
		display: none;
	}
}
:deep(.el-table .cell) {
	display: flex;
	align-items: center;
}
.universal-table-container {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	.main-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.table-wrap {
			flex: 1;
			overflow: hidden;
			.table-header {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 23px;
				.table-header-title {
					margin-top: 2px;
					white-space: nowrap; /* 不换行 */
					overflow: hidden;
					text-overflow: ellipsis; /* 超出省略 */
				}
			}
			.one-line-ellipsis {
				white-space: nowrap; /* 不换行 */
				overflow: hidden;
				text-overflow: ellipsis; /* 超出省略 */
			}
		}
		:deep(.table-wrap) {
			position: relative;
			.el-table {
				position: absolute;
			}
		}
		.dynamic-columns-container {
			position: absolute;
			bottom: 15px;
			left: 5px;
			z-index: 2000;
		}
		.pagination-wrap {
			padding: 0 10px;
			height: 52px;
			box-sizing: border-box;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			background-color: #ffffff;
			border-top: 1px solid rgba(0, 0, 0, 0.04);
		}
	}
}
</style>
