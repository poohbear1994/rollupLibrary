<template>
	<el-popover
		ref="popover"
		placement="bottom"
		trigger="click"
		:teleported="true"
		width="auto"
		style="height: 92px"
		@hide="popoverHide"
	>
		<template #reference>
			<el-button link size="small">
				<el-icon :style="{ color: isActive ? '#00cab7' : '#7c7f80' }"><Filter /></el-icon>
			</el-button>
		</template>
		<el-cascader-panel
			ref="cascaderPanelRef"
			v-model="checkedValue"
			class="cascader"
			:options="properTag"
			:props="props"
			collapse-tags
			collapse-tags-tooltip
			clearable
			size="small"
			@expand-change="handleExpandChange"
		/>
		<div class="filter-string-footer">
			<el-button size="small" @click="clear">清空</el-button>
			<el-button size="small" type="primary" :disabled="confirmBtnDisabled" @click="confirm">
				确定
			</el-button>
		</div>
	</el-popover>
</template>

<script lang="ts" setup>
import { ElPopover } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'
import { ref, watch, toRaw, PropType } from 'vue'

const emits = defineEmits(['confirm', 'clear'])
const propsData = defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
	field: {
		type: String,
		default: '',
	},
	multiple: {
		type: Boolean,
		default: true,
	},
	selectData: {
		type: Array as PropType<
			{
				[key: string]: string
				value?: any
			}[]
		>,
		default: () => [],
	},
})

//#region 数据源 -------------------------------------------------------------------------------------------------
const checkedValue = ref<any[]>([])
const dataInHide = ref<any[]>([])
const properTag = ref<any>([])
const popover = ref()
const confirmBtnDisabled = ref(true)
const props = ref({
	multiple: true,
	value: 'id',
	label: 'name',
})
//#endregion

//#region 交互行为 -----------------------------------------------------------------------------------------------

/**
 * @description: 气泡窗口显示事件
 * @return {*}
 * @Date Changed:
 */
function popoverHide(): void {
	checkedValue.value = dataInHide.value
}

/**
 * 清空筛选项
 */
function clear() {
	checkedValue.value = []
	dataInHide.value = []
	emits('clear', { field: propsData.field })
	popover.value.hide()
}

/**
 * 筛选项确认
 */
function confirm() {
	dataInHide.value = checkedValue.value
	const newCaDerData = checkedValue.value.map(item => item.slice(-1))
	const ids = [].concat(...newCaDerData)
	const edIds = toRaw(checkedValue.value)
	const list: any[] = toRaw(properTag.value)
	const texts: string[] = []
	for (const edId of edIds) {
		const edItemName = list.find((p: any) => p.id == edId[0])
		if (edItemName.children.length !== 0) {
			const edItemLabel = edItemName.children.find((p: any) => p.id == edId[1])
			if (edItemLabel.children.length !== 0) {
				const edItemLastLabel = edItemLabel.children.find((p: any) => p.id == edId[2])
				texts.push(`${edItemLastLabel.name}`)
			} else {
				texts.push(`${edItemLabel.name}`)
			}
		} else {
			texts.push(`${edItemName.name}`)
		}
	}
	const text = texts.join(',')
	emits('confirm', { field: propsData.field, value: ids, text })
	popover.value.hide()
}

/**
 * @description: 子面板展开钩子
 * @return {*}
 */
function handleExpandChange(): void {
	popover.value.popperRef.popperInstanceRef.update()
}

//#endregion

//#region 生命周期 -------------------------------------------------------------------------------------------------
watch(
	() => propsData.isActive,
	newValue => {
		if (!newValue) {
			clear()
		}
	}
)

watch(
	() => propsData.selectData,
	newValue => {
		if (newValue) {
			properTag.value = propsData.selectData
		}
	}
)

watch(checkedValue, () => {
	if (checkedValue.value.length > 0) {
		confirmBtnDisabled.value = false
	} else {
		confirmBtnDisabled.value = true
	}
})
//#endregion
</script>

<style lang="scss" scoped>
.cascader {
	border: none;
}
.filter-string-footer {
	box-sizing: border-box;
	margin-top: 10px;
	text-align: right;
}
</style>
