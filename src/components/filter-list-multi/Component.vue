<template>
	<el-popover
		ref="popover"
		trigger="click"
		placement="bottom-end"
		:teleported="true"
		@hide="popoverHide"
	>
		<template #reference>
			<el-button link size="small">
				<el-icon :style="{ color: isActive ? '#00cab7' : '#7c7f80' }">
					<Filter />
				</el-icon>
			</el-button>
		</template>
		<el-scrollbar>
			<el-checkbox v-model="checkAll" @change="handleCheckAllChange"
				><span style="font-size: 12px">全选</span></el-checkbox
			>
			<div class="filter-list-multi-checkbox-group-wrap">
				<el-checkbox-group v-model="checkedData" @change="handleDataChange">
					<el-checkbox
						v-for="item in dataSource"
						:key="item.value"
						:label="JSON.stringify(item)"
						style="display: block; line-height: 32px"
						><span style="font-size: 12px">{{ item.label }}</span></el-checkbox
					>
				</el-checkbox-group>
			</div>
		</el-scrollbar>
		<div class="filter-list-multi-footer">
			<el-button size="small" :disabled="confirmBtnDisabled" @click="clear">清空</el-button>
			<el-button size="small" type="primary" :disabled="confirmBtnDisabled" @click="confirm"
				>确定</el-button
			>
		</div>
	</el-popover>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { Filter } from '@element-plus/icons-vue'

interface optionType {
	label: string
	value: any
}
const props = defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
	field: {
		type: String,
		default: '',
	},
	dataSource: {
		type: Array as PropType<optionType[]>,
		default: () => [],
		required: true,
	},
})
const emits = defineEmits(['confirm', 'clear', 'change'])

const checkedData = ref<optionType[] | string[]>([])
const checkAll = ref(false)
const popover = ref()
const dataInHide = ref<optionType[] | string[]>([])
const confirmBtnDisabled = ref(true)

/**
 * @description: 全选切换行为
 * @param {*} val: 是否全选
 * @return {*}
 * @Date Changed:
 */
function handleCheckAllChange(val: boolean): void {
	if (val) {
		checkAll.value = true
		checkedData.value = props.dataSource.map(item => JSON.stringify(item))
	} else {
		checkAll.value = false
		checkedData.value = []
	}
}

/**
 * @description: 选择发生变化
 * @param {*} value
 * @return {*}
 * @Date Changed:
 */
function handleDataChange(value: any[]) {
	const checkedCount = value.length
	if (checkedCount === props.dataSource.length && checkedCount !== 0) {
		checkAll.value = true
	} else {
		checkAll.value = false
	}
	const labels: any[] = []
	const values: any[] = []
	checkedData.value.forEach((element: any) => {
		element = JSON.parse(element)
		labels.push(element.label)
		values.push(element.value)
	})
	emits('change', {
		value: values,
		label: labels,
		field: props.field,
	})
}

/**
 * @description: 确认事件
 * @return {*}
 * @Date Changed:
 */
function confirm(): void {
	const labels: any[] = []
	const values: any[] = []
	checkedData.value.forEach((element: any) => {
		element = JSON.parse(element)
		labels.push(element.label)
		values.push(element.value)
	})
	emits('confirm', {
		value: values,
		label: labels,
		field: props.field,
	})
	dataInHide.value = checkedData.value
	popover.value.hide()
}

/**
 * @description: 清除选择事件
 * @return {*}
 * @Date Changed:
 */
function clear(): void {
	checkAll.value = false
	checkedData.value = []
	emits('clear', { value: [], label: [], field: props.field })
	dataInHide.value = []
	popover.value.hide()
}

/**
 * @description: 气泡窗口隐藏事件
 * @return {*}
 * @Date Changed:
 */
function popoverHide(): void {
	checkedData.value = dataInHide.value
	const checkedCount = checkedData.value.length
	if (checkedCount === props.dataSource.length && checkedCount !== 0) {
		checkAll.value = true
	} else {
		checkAll.value = false
	}
}
watch(
	() => props.isActive,
	newValue => {
		if (!newValue) {
			clear()
		}
	}
)
watch(checkedData, () => {
	if (checkedData.value.length > 0) {
		confirmBtnDisabled.value = false
	} else {
		confirmBtnDisabled.value = true
	}
})
</script>
<style lang="scss" scoped>
.filter-list-multi-checkbox-group-wrap {
	max-height: 230px;
}
.filter-list-multi-footer {
	box-sizing: border-box;
	margin-top: 10px;
	padding-bottom: 5px;
	text-align: right;
}
</style>
