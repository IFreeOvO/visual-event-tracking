import type { ProjectFormDrawerProps } from './components/project-form-drawer'
import type { Project } from '@/models/vo/project.vo'
import { PlusOutlined } from '@ant-design/icons'
import { usePagination } from 'ahooks'
import {
    Button,
    Card,
    Col,
    Empty,
    Flex,
    FormInstance,
    message,
    Pagination,
    PaginationProps,
    Row,
} from 'antd'
import { createProject, deleteProject, getProjects, updateProject } from '@/api/service/project'
import { LazyImportOnCondition } from '@/components/common/lazy-import-on-condition'
import Loading from '@/components/common/loading'
import { GLOBAL_PAGE_SIZE } from '@/constants/common'
import { ModeEnum } from '@/constants/enums'
import useDrawer from '@/hooks/business/use-drawer'
import useRouter from '@/hooks/common/use-router'
import ProjectItem, { ProjectItemProps } from './components/project-item'
const ProjectFormDrawer = lazy(() => import('./components/project-form-drawer'))

const queryList: any = async ({ current, pageSize }: { current: number; pageSize: number }) => {
    return getProjects({
        page: current,
        limit: pageSize,
    }).then((resp) => {
        const [err, result] = resp
        if (err) {
            return {
                total: 0,
                list: [],
            }
        }
        const data = result.data
        return {
            total: data.total,
            list: data.data,
        }
    })
}

const ProjectConfigsPage: React.FC = () => {
    const { push } = useRouter()
    const [mode, setMode] = useImmer<ModeEnum>(ModeEnum.Create)
    const [project, setProject] = useImmer<Project | undefined>(undefined)
    const {
        data = {
            total: 0,
            list: [],
        },
        run,
        loading,
        pagination,
    } = usePagination<
        {
            total: number
            list: Project[]
        },
        any
    >(queryList, {
        defaultPageSize: GLOBAL_PAGE_SIZE,
    })
    const { isOpenDrawer, drawerTitle, setDrawerTitle, toggleDrawerState } = useDrawer({
        title: '新增项目',
    })
    const showTotal: PaginationProps['showTotal'] = (total) => `共 ${total} 页`

    const onClickCreateBtn = () => {
        setMode(ModeEnum.Create)
        setDrawerTitle('新增项目')
        toggleDrawerState()
    }

    const Title = memo(() => {
        return (
            <Button type="primary" icon={<PlusOutlined />} onClick={onClickCreateBtn}>
                创建项目
            </Button>
        )
    })

    const refreshList = () => {
        run({
            current: pagination.current,
            pageSize: pagination.pageSize,
        })
    }

    const onDrawerSubmitSuccess = async (value: Project, drawerForm: FormInstance) => {
        let err
        if (mode === ModeEnum.Create) {
            err = (await createProject(value))[0]
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { projectUrl, ...resetValue } = value
            err = (
                await updateProject(
                    Object.assign(
                        {
                            id: project?.id,
                        },
                        resetValue,
                    ),
                )
            )[0]
        }

        if (err) {
            return
        }
        message.open({
            content: '操作成功',
            type: 'success',
        })
        drawerForm.resetFields()
        toggleDrawerState()
        refreshList()
    }

    const onDeleteProject: ProjectItemProps['onDelete'] = async (id) => {
        const [err] = await deleteProject(id)
        if (err) {
            return
        }
        refreshList()
        message.open({
            content: '操作成功',
            type: 'success',
        })
    }

    const onEditProject: ProjectItemProps['onEdit'] = (id) => {
        const project = data.list.find((item) => item.id === id)
        if (project) {
            setProject(project)
        }
        setMode(ModeEnum.Edit)
        setDrawerTitle('编辑项目')
        toggleDrawerState()
    }

    const handleDebug: ProjectItemProps['onDebug'] = (id) => {
        const project = data.list.find((item) => item.id === id)
        push(
            `/tracking/validation/${id}?name=${project?.projectName}&url=${encodeURIComponent(project?.projectUrl ?? '')}`,
        )
    }

    const onCloseDrawer = (drawerForm: FormInstance) => {
        drawerForm.resetFields()
        toggleDrawerState()
    }

    return (
        <>
            <Card
                title={<Title />}
                variant="outlined"
                className="uno-h-full uno-flex uno-flex-col "
                classNames={{
                    header: 'uno-flex-shrink-0',
                    body: 'uno-flex-1 uno-min-h-0 uno-flex uno-flex-col',
                }}
            >
                <div className="uno-max-h-[calc(100%-40px)] uno-overflow-y-auto uno-overflow-x-hidden uno-relative">
                    <Loading spinning={loading}>
                        {data.list.length === 0 ? <Empty /> : null}
                        <Row gutter={[16, 24]}>
                            {data.list.map((item) => (
                                <Col span={8} key={item.id}>
                                    <ProjectItem
                                        id={item.id}
                                        url={item.projectUrl}
                                        title={item.projectName}
                                        desc={item.projectDesc}
                                        onDelete={onDeleteProject}
                                        onEdit={onEditProject}
                                        onDebug={handleDebug}
                                    ></ProjectItem>
                                </Col>
                            ))}
                        </Row>
                    </Loading>
                </div>

                <Flex justify="flex-end" className="uno-mt-16px">
                    <Pagination
                        size="small"
                        total={data?.total}
                        showTotal={showTotal}
                        onChange={pagination.onChange}
                    />
                </Flex>
            </Card>
            <LazyImportOnCondition<ProjectFormDrawerProps>
                lazy={ProjectFormDrawer}
                isLoad={isOpenDrawer}
                componentProps={{
                    mode,
                    drawerTitle,
                    project,
                    onDrawerClose: onCloseDrawer,
                    onSubmitSuccess: onDrawerSubmitSuccess,
                    open: isOpenDrawer,
                }}
            ></LazyImportOnCondition>
        </>
    )
}

export default ProjectConfigsPage
