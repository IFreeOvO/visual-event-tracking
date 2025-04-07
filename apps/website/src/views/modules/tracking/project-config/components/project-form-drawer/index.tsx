import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { Project } from '@/models/vo/project.vo'
import type { FormInstance } from 'antd'
import { Form } from 'antd'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'
import { ModeEnum } from '@/constants/enums'

type ProjectFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: (form: FormInstance) => void
    onSubmitSuccess?: (value: Project, form: FormInstance) => void
    project?: Project
    mode?: ModeEnum
}

const ProjectFormDrawer: React.FC<ProjectFormDrawerProps> = memo((props) => {
    const { onDrawerClose, onSubmitSuccess, project, open, mode = ModeEnum.Create } = props
    const [drawerForm] = Form.useForm()

    const formItemsConfig = useMemo<FormItemConfig<Project>[]>(
        () => [
            {
                itemComponentProps: {
                    label: '项目名称',
                    name: 'projectName',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入项目名称',
                    allowClear: true,
                    maxLength: 20,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '项目描述',
                    name: 'projectDesc',
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入项目描述',
                    allowClear: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '项目地址',
                    name: 'projectUrl',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入项目地址',
                    allowClear: true,
                    disabled: mode === ModeEnum.Edit,
                },
                colProps: {
                    span: 24,
                },
            },
        ],
        [mode],
    )

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const onFinish = (values: Project) => {
        onSubmitSuccess && onSubmitSuccess(values, drawerForm)
    }

    const onClose: FormDrawerProps['onClose'] = () => {
        onDrawerClose && onDrawerClose(drawerForm)
    }

    const onCancel: FormDrawerProps['onCancel'] = () => {
        onDrawerClose && onDrawerClose(drawerForm)
    }

    useEffect(() => {
        if (open && mode === ModeEnum.Edit) {
            drawerForm.setFieldValue('projectName', project?.projectName)
            drawerForm.setFieldValue('projectDesc', project?.projectDesc)
            drawerForm.setFieldValue('projectUrl', project?.projectUrl)
        }
    }, [open, drawerForm, project, mode])

    return (
        <>
            <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
                <DynamicForm<Project>
                    formItemsConfig={formItemsConfig}
                    form={drawerForm}
                    onFinish={onFinish}
                    name="project-drawer-form"
                ></DynamicForm>
            </FormDrawer>
        </>
    )
})

export default ProjectFormDrawer
