import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Flex, FlexProps, Popconfirm, PopconfirmProps } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { ButtonProps } from 'antd/lib'
import { ReactElement } from 'react'
import React from 'react'

type ButtonTypes = ['edit', 'popDelete']

export type onTableButtonGroupClickType = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: ButtonTypes[number],
) => void

export type baseButton = {
    type: Exclude<ButtonTypes[number], 'popDelete'>
    key?: string | number
    buttonProps?: {
        onClick?: ButtonProps['onClick']
    }
}

export type PopButton = {
    type: Exclude<ButtonTypes[number], 'edit'>
    key?: string | number
    buttonProps?: {
        onClick?: ButtonProps['onClick']
    }
    popProps?: PopconfirmProps
}

export type TableButton = baseButton | PopButton

export interface TableButtonGroupProps {
    componentSize?: SizeType
    wrap?: boolean
    gap?: FlexProps['gap']
    justify?: FlexProps['justify']
    align?: FlexProps['align']
    buttons?: TableButton[]
    onButtonGroupClick?: onTableButtonGroupClickType
}

const TableButtonGroup: React.FC<TableButtonGroupProps> = memo((props) => {
    const {
        componentSize = 'middle',
        wrap = true,
        gap = 'middle',
        buttons = [],
        justify = 'normal',
        align = 'normal',
    } = props

    const makeButton = (index: number, buttonConfig: TableButton) => {
        const type = buttonConfig.type
        const buttonMap: Record<ButtonTypes[number], ReactElement> = {
            edit: (
                <Button
                    key={index ?? buttonConfig.key}
                    onClick={buttonConfig.buttonProps?.onClick}
                    variant="outlined"
                    icon={<EditOutlined />}
                >
                    编辑
                </Button>
            ),
            popDelete: (
                <Popconfirm
                    key={index ?? (buttonConfig as PopButton).key}
                    {...((buttonConfig as PopButton).popProps ?? { title: '' })}
                >
                    <Button
                        color="danger"
                        onClick={buttonConfig.buttonProps?.onClick}
                        variant="outlined"
                        icon={<DeleteOutlined />}
                    >
                        删除
                    </Button>
                </Popconfirm>
            ),
        }
        return buttonMap[type]
    }

    return (
        <ConfigProvider componentSize={componentSize}>
            <Flex gap={gap} justify={justify} align={align} wrap={wrap} id="action-button-group">
                {buttons.map((buttonConfig, i) => makeButton(i, buttonConfig))}
            </Flex>
        </ConfigProvider>
    )
})

export default TableButtonGroup
