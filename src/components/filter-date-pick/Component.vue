<template>
	<el-popover
		ref="popoverRef"
		:width="width"
		trigger="click"
		placement="bottom-end"
		:teleported="true"
		popper-class="popperClass"
		@show="popoverShow"
		@hide="popoverHide"
	>
		<template #reference>
			<el-button link size="small">
				<el-icon :style="{ color: isActive ? '#00cab7' : '#7c7f80' }">
					<Calendar />
				</el-icon>
			</el-button>
		</template>
		<div class="filter-date-pick-center">
			<el-date-picker
				ref="datepickerRef"
				v-model="time"
				:type="type"
				value-format="YYYY-MM-DD HH:mm:ss"
				placeholder="选择时间"
				:teleported="false"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				range-separator="至"
				:default-time="
					type === 'daterange' || type === 'datetimerange'
						? [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]
						: new Date(2000, 1, 1, 0, 0, 0)
				"
				:popper-options="popperOptions"
			/>
		</div>
		<div class="filter-date-pick-footer">
			<el-button size="small" :disabled="confirmBtnDisabled" @click="clear">清空</el-button>
			<el-button type="primary" size="small" :disabled="confirmBtnDisabled" @click="confirm"
				>确定</el-button
			>
		</div>
	</el-popover>
</template>
<script lang="ts" setup>
import { ref, PropType, computed, watch } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

const props = defineProps({
	type: {
		type: String as PropType<
			'year' | 'month' | 'date' | 'datetime' | 'week' | 'datetimerange' | 'daterange'
		>,
		default: 'datetime',
	},
	field: {
		type: String,
		default: '',
	},
	isActive: {
		type: Boolean,
		default: false,
	},
})

// 解决日期组件超出屏幕，遮挡问题 https://github.com/element-plus/element-plus/issues/6824
const popperOptions = {
	placement: 'bottom-end',
	modifiers: [
		{
			name: 'flip',
			options: {
				fallbackPlacements: ['bottom', 'bottom-start'],
			},
		},
	],
}

const emits = defineEmits(['confirm', 'clear'])
const time = ref('')
const dataInHide = ref('')
const popoverRef = ref()
const datepickerRef = ref()
const confirmBtnDisabled = ref(true)
const width = computed<number>(() => {
	switch (props.type) {
		case 'datetimerange':
			return 500
		default:
			return 240
	}
})

/**
 * @description: 清空
 * @return {*}
 * @Date Changed:
 */
function clear() {
	time.value = ''
	emits('clear', { value: time.value, field: props.field })
	popoverRef.value.hide()
	dataInHide.value = ''
}

/**
 * @description: 确认
 * @return {*}
 * @Date Changed:
 */
function confirm() {
	dataInHide.value = time.value
	emits('confirm', { value: time.value, field: props.field })
	popoverRef.value.hide()
}

/**
 * @description: 气泡卡片显示事件
 * @return {*}
 * @Date Changed:
 */
function popoverShow(): void {
	datepickerRef.value.focus()
}

/**
 * @description: 气泡窗口显示事件
 * @return {*}
 * @Date Changed:
 */
function popoverHide(): void {
	time.value = dataInHide.value
}

watch(
	() => props.isActive,
	newValue => {
		if (!newValue) {
			clear()
		}
	}
)
watch(time, () => {
	if (time.value) {
		confirmBtnDisabled.value = false
	} else {
		confirmBtnDisabled.value = true
	}
})
</script>
<style lang="scss" scoped>
.filter-date-pick-center {
	display: flex;
	justify-content: center;
}
.filter-date-pick-footer {
	box-sizing: border-box;
	margin-top: 10px;
	padding-bottom: 5px;
	text-align: right;
}
</style>
