<template>
	<div class="head-wrap">
		<div class="head-left">
			<slot name="default"></slot>
		</div>
		<div class="head-right">
			<slot name="right"></slot>
			<div v-if="needReload" class="head-right-item">
				<el-tooltip content="刷新" placement="top">
					<el-button type="primary" :loading="reloadLoading" link @click="handleReload">
						<template #icon>
							<el-icon><RefreshRight /></el-icon>
						</template>
					</el-button>
				</el-tooltip>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'

const props = defineProps({
	needReload: {
		type: Boolean,
		default: false,
	},
	reloadMethod: {
		type: Function as PropType<() => Promise<any>>,
		default: () => Promise.resolve(),
	},
})

const reloadLoading = ref(false)

/**
 * @description: 刷新行为
 * @return {*}
 */
function handleReload(): void {
	reloadLoading.value = true
	props
		.reloadMethod()
		.then(() => {
			reloadLoading.value = false
		})
		.catch(() => {
			reloadLoading.value = false
		})
}
</script>
<style lang="scss" scoped>
.head-wrap {
	min-height: 36px;
	display: flex;
	align-items: center;
	padding-bottom: 12px;
	justify-content: space-between;
	.head-left {
		font-size: 21px;
	}
	.head-right {
		display: flex;
		align-items: center;
		.head-right-item {
			margin-left: 10px;
		}
	}
}
</style>
