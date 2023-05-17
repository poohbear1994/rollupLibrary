<template>
	<el-dropdown placement="top-start">
		<div class="rotate">
			<el-button link class="rotate">
				<el-icon size="16px"><Setting /></el-icon>
			</el-button>
		</div>
		<template #dropdown>
			<div class="columns-checkbox-opt-container">
				<el-checkbox-group v-model="selectedColumnKeys" class="columns-checkbox-opt-container">
					<div v-for="(column, index) in columnsList" :key="column.propName" class="checkbox-item">
						<el-checkbox :label="column.propName" :disabled="!index">{{
							column.headerName
						}}</el-checkbox>
					</div>
				</el-checkbox-group>
			</div>
		</template>
	</el-dropdown>
</template>
<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { getLocalStorage } from '../../utils/storage'
import { ColumnInterface } from './interface'

const props = defineProps({
	dataSource: {
		type: Array as PropType<ColumnInterface[]>,
		required: true,
	},
	initCheckedColumns: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
})

const emits = defineEmits(['checkedColumnsChange'])

// ----------------------------------------------------------------- 数据源 --------------------------------------------------------------
const permissionList = getLocalStorage('permission') as Array<string>
const columnsList = ref(getColumnsList())
const selectedColumnKeys = ref<string[]>([])

// ----------------------------------------------------------------- 数据处理 --------------------------------------------------------------

/**
 * @description: 获取有权限的列
 */
function getColumnsList(): Array<ColumnInterface> {
	return props.dataSource.filter(c => {
		const { permission } = c
		// 如果没有权限，直接显示
		if (!permission) return true
		// 如果是数组
		if (Array.isArray(permission)) {
			return permission.some(p => permissionList.includes(p))
		}
		// 如果是字符串
		return permissionList.includes(permission)
	})
}

/**
 * @description: 初始化已选定的列的key
 * @return {*}
 */
function initSelectedColumnKeys(): string[] {
	// 如果传入了初始化配置
	if (props.initCheckedColumns.length) {
		const pcl = columnsList.value.filter(column => {
			return props.initCheckedColumns.includes(column.propName)
		})
		return pcl.map(c => c.propName)
	} else {
		return columnsList.value.map(column => column.propName)
	}
}

// ----------------------------------------------------------------- 生命周期 --------------------------------------------------------------
watch(selectedColumnKeys, keys => {
	const selectedColumns = columnsList.value.filter(column => {
		if (keys.includes(column.propName)) return true
	})
	emits('checkedColumnsChange', selectedColumns)
})

onMounted(() => {
	selectedColumnKeys.value = initSelectedColumnKeys()
})
</script>
<style lang="scss" scoped>
.columns-checkbox-opt-container {
	max-width: 160px;
	max-height: 400px;
	box-sizing: border-box;
	padding: 1px 10px 5px 5px;
}
@keyframes custom {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}
.rotate:hover {
	color: #00cab7;
	transform: rotate(0);
	animation: custom 3s ease;
}
</style>
