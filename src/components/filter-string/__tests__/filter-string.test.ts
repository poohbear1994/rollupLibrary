import { mount } from '@vue/test-utils'
import { describe, test, expect } from '@jest/globals'
import { ElPopover, ElButton, ElIcon, ElInput } from 'element-plus'
import FilterString from '../Component.vue'

describe('测试filterString组件', () => {
	test('测试props传值', () => {
		const wrapper = mount(FilterString as any, {
			propsData: {
				isActive: true,
				field: 'string',
			},
		})
		expect(wrapper.props().field).toBe('number')
		expect(wrapper.props().field).toBe('string')
		expect(wrapper.props().isActive).toBe(true)
		expect(wrapper.findComponent(ElPopover).exists()).toBe(true)
		expect(wrapper.findComponent(ElIcon).exists()).toBe(true)
		expect(wrapper.findComponent(ElInput).exists()).toBe(true)
		expect(wrapper.findComponent(ElButton).exists()).toBe(true)
	})
})
