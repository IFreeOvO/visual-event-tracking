import type { FilterRule } from './format-filter'
import { formatFilter } from './format-filter'
import { objectToQuery } from './object-to-query'

export const getQueryWithFilter = (data: Record<string, any> = {}, rules: FilterRule[]) => {
    const formattedFilter = formatFilter(data.filter, rules)
    if (Object.prototype.hasOwnProperty.call(data, 'filter')) {
        delete data.filter
    }
    const query = objectToQuery(data)
    if (formattedFilter) {
        return query + '&' + formattedFilter
    } else {
        return query
    }
}
