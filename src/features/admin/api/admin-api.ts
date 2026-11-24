import { categoriesApi } from './admin/categories-api'
import { dashboardApi } from './admin/dashboard-api'
import { menuApi } from './admin/menu-api'
import { modifiersApi } from './admin/modifiers-api'
import { settingsApi } from './admin/settings-api'
import { staffApi } from './admin/staff-api'
import { tablesApi } from './admin/tables-api'

export { adminKeys } from './admin/keys'
export type { PageParams } from './admin/query-utils'
export type { CategoryInput } from './admin/categories-api'
export type { MenuItemInput } from './admin/menu-api'
export type {
  ModifierGroupInput,
  ModifierOptionInput,
} from './admin/modifiers-api'
export type { TableInput } from './admin/tables-api'
export type { StaffInput } from './admin/staff-api'
export type {
  UpdateSettingsInput,
  UpdateTaxRuleInput,
} from './admin/settings-api'

export { useCategories, useCategoriesPage } from './admin/categories-api'
export { useDashboard } from './admin/dashboard-api'
export { useMenuItems } from './admin/menu-api'
export { useModifierGroups, useModifierGroupsPage } from './admin/modifiers-api'
export { useCashierTables, useTables } from './admin/tables-api'
export { useStaff } from './admin/staff-api'
export { useSettings, useTaxRules } from './admin/settings-api'

export const adminApi = {
  dashboard: dashboardApi.get,
  categories: categoriesApi,
  menu: menuApi,
  modifiers: modifiersApi,
  tables: tablesApi,
  staff: staffApi,
  settings: settingsApi,
}
