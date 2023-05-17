<template>
	<el-dropdown max-height="230px" trigger="click" class="filter-list-wrap">
		<el-button link size="small">
			<el-icon :style="{ color: isActive ? '#00cab7' : '#7c7f80' }">
				<Filter />
			</el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu max-height="240px">
				<el-dropdown-item
					v-for="(item, index) in dataSource"
					:key="item.value"
					@click="itemClick(item, index)"
				>
					<div
						class="filter-list-item-name"
						:class="index === activeIndex ? 'filter-list-active-item' : ''"
					>
						<span style="font-size: 12px">
							{{ item[labelProperty] }}
						</span>
					</div>
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script lang="ts" setup>
import { ref, PropType, watch } from 'vue'
import { Filter } from '@element-plus/icons-vue'
const props = defineProps({
	dataSource: {
		type: Array as PropType<
			{
				[key: string]: string
				value?: any
			}[]
		>,
		required: true,
	},
	field: {
		type: String,
		default: '',
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	labelProperty: {
		type: String,
		default: 'label',
	},
})
const emits = defineEmits(['confirm', 'clear'])
const activeIndex = ref()
/**
 * @description: 下拉菜单项点击事件
 * @param {*} item
 * @param {*} index
 * @return {*}
 * @Date Changed:
 */
function itemClick(item: any, index: number): void {
	emits('confirm', {
		value: item.value,
		index: index,
		field: props.field,
	})
	activeIndex.value = index
}

/**
 * @description: 清空事件
 * @return {*}
 * @Date Changed:
 */
function clear() {
	activeIndex.value = null
	emits('clear', {
		value: '',
		index: activeIndex.value,
		field: props.field,
	})
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
.filter-list-wrap {
	display: flex;
	justify-content: center;
	align-items: center;
}
.filter-list-item-name {
	max-width: 208px;
	overflow: hidden;
	word-wrap: break-word;
	word-break: break-all;
	white-space: pre-wrap;
}
.filter-list-active-item {
	color: #00cab7;
}
</style>
