<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
	<el-popover
		ref="popoverRef"
		trigger="click"
		placement="bottom-end"
		:teleported="true"
		width="220px"
		@show="popoverShowHandler"
		@hide="popoverHideHandler"
	>
		<template #reference>
			<el-button link size="small">
				<el-icon :style="{ color: isActive ? '#00cab7' : '#7c7f80' }">
					<Search />
				</el-icon>
			</el-button>
		</template>
		<el-input
			ref="inputRef"
			v-model="searchTxt"
			placeholder="请输入关键字"
			:prefix-icon="Search"
			@keyup.enter.native="confirm"
		></el-input>
		<div class="filter-string-footer">
			<el-button size="small" type="" @click="clear">清空</el-button>
			<el-button size="small" type="primary" @click="confirm">确定</el-button>
		</div>
	</el-popover>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
	field: {
		type: String,
		default: '',
	},
})
const emits = defineEmits(['confirm', 'input', 'clear'])

const popoverRef = ref()
const inputRef = ref()
const searchTxt = ref('')

/**
 * @description: 清空
 * @return {*}
 */
function clear(): void {
	searchTxt.value = ''
	emits('clear', { value: searchTxt.value, field: props.field })
	popoverRef.value.hide()
}

/**
 * @description: 确认搜索
 * @return {*}
 * @Date Changed:
 */
function confirm(): void {
	if (!searchTxt.value.trim()) {
		ElMessage({
			type: 'error',
			message: '关键字不能为空',
		})
		searchTxt.value = ''
		return
	}
	emits('confirm', { value: _.escape(searchTxt.value.trim()), field: props.field })
	popoverRef.value.hide()
}

/**
 * @description: 气泡卡片显示事件
 * @return {*}
 * @Date Changed:
 */
function popoverShowHandler(): void {
	inputRef.value.focus()
}

/**
 * @description: 隐藏
 * @return {*}
 * @Date Changed:
 */
function popoverHideHandler(): void {
	popoverRef.value.hide()
}

watch(
	() => props.isActive,
	newValue => {
		if (!newValue) {
			clear()
		}
	}
)
</script>

<style lang="scss" scoped>
.dropdown-wrap {
	max-height: 400px;
	margin-top: 10px;
	.dropdown-item {
		&:hover {
			cursor: pointer;
			color: #1c3dd7;
		}
	}
}
.filter-string-footer {
	box-sizing: border-box;
	margin-top: 10px;
	text-align: right;
}
</style>
