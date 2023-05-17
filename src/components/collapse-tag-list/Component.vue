<template>
	<div
		v-show="sourceData.length"
		class="tag-list-container"
		:style="isExpand ? {} : { height: `${rowHeight}px` }"
	>
		<div ref="tagContainer" class="tag-list-left">
			<template v-for="{ key, value } in sourceData" :key="key">
				<el-tag
					class="tag"
					closable
					@close="closeTag(key)"
					@mouseout="tipVisible = false"
					@mouseover="showTagTooltip($event.currentTarget, key, value)"
				>
					{{ getValue(key, value) }}
				</el-tag>
			</template>
			<el-tooltip
				:visible="tipVisible"
				placement="top"
				:popper-options="{
					modifiers: [
						{
							name: 'computeStyles',
							options: {
								adaptive: false,
								enabled: false,
							},
						},
					],
				}"
				:virtual-ref="buttonRef"
				virtual-triggering
				trigger="click"
			>
				<template #content>
					<span>{{ tipContent }}</span>
				</template>
			</el-tooltip>
			<el-button v-show="sourceData.length > 0" link @click="clearTag">清除</el-button>
		</div>
		<div v-show="isShowExpand" class="tag-list-right">
			<el-icon :class="['icon', { active: isExpand }]" @click="isExpand = !isExpand"
				><ArrowDown
			/></el-icon>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, computed, nextTick, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
/**
 * 数据源类型
 */
type SourceDataType = {
	key: string
	value: string
}

/**
 *  tooltip 相关变量
 */
const buttonRef = ref()
const tipVisible = ref(false)
const tipContent = ref('')

const props = defineProps({
	/**
	 * 需要渲染的tag数据
	 */
	data: {
		type: [Array, Object],
		required: true,
	},
	/**
	 * tag文字内容格式化器
	 */
	formatTag: {
		type: Function,
		default: null,
	},
})

const emits = defineEmits(['closeTag', 'clearTag'])

/**
 * 当前是否已展开
 */
const isExpand = ref(false)
/**
 * tag列表的容器dom
 */
const tagContainer = ref<HTMLElement | null>(null)
/**
 * 是否显示展开收缩图标
 */
const isShowExpand = ref(false)

/**
 * tag的行高（此为固定值，因css中已经写死）
 */
const rowHeight = 28

/**
 * 实际绑定数据（因要做数组和对象的兼容处理）
 */
const sourceData = computed(function (): Array<SourceDataType> {
	const data = props.data
	if (Array.isArray(data)) {
		return data as Array<SourceDataType>
	}
	return Object.entries(data).map(([key, value]) => ({ key, value }))
})

watch(sourceData, async function (val) {
	if (val.length === 0) {
		isShowExpand.value = false
		isExpand.value = false
		return
	}
	await nextTick()
	//计算是否显示展开图标
	isShowExpand.value = checkDomScroll(tagContainer.value!, 'height')
})

function closeTag(k: string) {
	tipVisible.value = false
	emits('closeTag', k)
}

function clearTag() {
	isShowExpand.value = false
	isExpand.value = false
	emits('clearTag')
}

/**
 * @description: 获取标签实际显示值
 * @param {string} key 键
 * @param {string} val 值
 * @return {string} 标签实际显示值
 */
function getValue(key: string, val: string): string {
	if (props.formatTag == null) {
		return val
	}
	return props.formatTag(key, val)
}

/**
 * @description: 判断是否折叠或省略
 * https://github.com/element-plus/element-plus/blob/dev/packages/components/table/src/table-body/events-helper.ts
 * @param {*} dom
 * @return {*}
 */
function checkDomScroll(dom: HTMLElement, type: 'height' | '' = ''): boolean {
	let result = false
	const range = document.createRange()
	range.setStart(dom, 0)
	range.setEnd(dom, dom.childNodes.length)
	if (type == 'height') {
		const rangeHeight = Math.round(range.getBoundingClientRect().height)

		if (rangeHeight > rowHeight || dom.scrollHeight > rowHeight) {
			result = true
		}
	} else {
		const rangeWidth = Math.round(range.getBoundingClientRect().width)

		if (rangeWidth > dom.offsetWidth || dom.scrollWidth > dom.offsetWidth) {
			result = true
		}
	}
	return result
}

/**
 * @description: 显示当前 tooltip
 * @param {HTMLElement} dom 当前 tag
 * @param {string} tagKey
 * @param {string} tagValue
 * @return {void}
 */
function showTagTooltip(dom: HTMLElement, tagKey: string, tagValue: string): void {
	if (checkDomScroll(dom)) {
		buttonRef.value = dom
		tipVisible.value = true
		tipContent.value = getValue(tagKey, tagValue)
	}
}
</script>
<style lang="scss" scoped>
.tag-list-container {
	overflow: hidden;
	display: flex;
	.tag-list-left {
		background-color: #fff;
		.tag {
			background-color: #e5f9f7;
			color: #00cab7;
			margin: 2px 5px 2px 0;
			:deep(.el-tag__content) {
				max-width: 350px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.tag-list-right {
		flex-basis: 30px;
		display: flex;
		justify-content: center;
		align-items: start;
		padding-top: 5px;
		.icon {
			cursor: pointer;
			transition-duration: 0.3s;
			&.active {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
