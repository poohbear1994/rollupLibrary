import installVPermission from './utils/v-permission'
import filterCascaderConfig from './components/filter-cascader'
import filterDatePickConfig from './components/filter-date-pick'
import filterListConfig from './components/filter-list'
import filterListMultiConfig from './components/filter-list-multi'
import filterStringConfig from './components/filter-string'
import universalTableConfig from './components/universal-table'
import collapseTagListConfig from './components/collapse-tag-list'
import tablePageHeaderConfig from './components/table-page-header'

const a = 0

const componentConfigList = [
	filterCascaderConfig,
	filterDatePickConfig,
	filterListConfig,
	filterListMultiConfig,
	filterStringConfig,
	collapseTagListConfig,
	tablePageHeaderConfig,
	universalTableConfig,
]

export * from './utils/storage'
export * from './components/filter-string'
export * from './components/filter-cascader'
export * from './components/filter-date-pick'
export * from './components/filter-list'
export * from './components/filter-list-multi'
export * from './components/universal-table'
export * from './components/collapse-tag-list'
export * from './components/table-page-header'

/**
 * @description: 安装zdi-components-lib
 * @param {any} app vue应用实例
 */
export default (app: any) => {
	installVPermission(app)
	componentConfigList.forEach(c => {
		const { Component, name } = c
		app.component(name, Component)
	})
}
