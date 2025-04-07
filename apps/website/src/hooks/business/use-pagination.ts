import { GLOBAL_PAGE_SIZE } from '@/constants/common'

const usePagination = () => {
    const [paginationTotal, setPaginationTotal] = useImmer(0)
    const [page, setPage] = useImmer(1)
    const [pageSize, setPageSize] = useImmer(GLOBAL_PAGE_SIZE)
    const pageSizeOptions = ['10', '20', '50', '100']
    const showTotal = (total: number) => `共 ${total} 条`

    const onChange = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    return {
        paginationTotal,
        page,
        pageSize,
        pageSizeOptions,
        showTotal,
        onChange,
        setPage,
        setPageSize,
        setPaginationTotal,
    }
}

export default usePagination
