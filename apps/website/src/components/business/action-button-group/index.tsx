import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    RedoOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import { Button, ConfigProvider, Flex, FlexProps } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { ReactElement } from 'react'
import React from 'react'

type ButtonTypes = ['add', 'refresh', 'search', 'reset', 'edit', 'delete', 'cancel', 'confirm']

export type onButtonGroupClickType = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: ButtonTypes[number],
) => void

export interface ActionButtonGroupProps {
    componentSize?: SizeType
    wrap?: boolean
    gap?: FlexProps['gap']
    buttons?: ButtonTypes[number][]
    onButtonGroupClick?: onButtonGroupClickType
    justify?: FlexProps['justify']
    align?: FlexProps['align']
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = memo((props) => {
    const {
        componentSize = 'middle',
        wrap = true,
        gap = 'middle',
        buttons = [],
        justify = 'normal',
        align = 'normal',
        onButtonGroupClick,
    } = props

    const makeButton = (
        type: ButtonTypes[number],
        index: number,
        onClick?: ActionButtonGroupProps['onButtonGroupClick'],
    ) => {
        const onHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                onClick(event, type)
            }
        }

        const buttonMap: Record<ButtonTypes[number], ReactElement> = {
            add: (
                <Button
                    key={index}
                    onClick={onHandleClick}
                    color="primary"
                    variant="outlined"
                    icon={<PlusOutlined />}
                >
                    新增
                </Button>
            ),
            refresh: (
                <Button key={index} onClick={onHandleClick} icon={<RedoOutlined />}>
                    刷新
                </Button>
            ),
            search: (
                <Button
                    key={index}
                    onClick={onHandleClick}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                >
                    查询
                </Button>
            ),
            reset: (
                <Button key={index} onClick={onHandleClick} icon={<RedoOutlined />}>
                    重置
                </Button>
            ),
            edit: (
                <Button
                    key={index}
                    onClick={onHandleClick}
                    variant="outlined"
                    icon={<EditOutlined />}
                >
                    编辑
                </Button>
            ),
            delete: (
                <Button
                    key={index}
                    color="danger"
                    onClick={onHandleClick}
                    variant="outlined"
                    icon={<DeleteOutlined />}
                >
                    删除
                </Button>
            ),
            cancel: (
                <Button key={index} onClick={onHandleClick}>
                    取消
                </Button>
            ),
            confirm: (
                <Button key={index} onClick={onHandleClick} type="primary" htmlType="submit">
                    确认
                </Button>
            ),
        }
        return buttonMap[type]
    }

    return (
        <ConfigProvider componentSize={componentSize}>
            <Flex gap={gap} wrap={wrap} justify={justify} align={align} id="action-button-group">
                {buttons.map((buttonType, i) => makeButton(buttonType, i, onButtonGroupClick))}
            </Flex>
        </ConfigProvider>
    )
})

export default ActionButtonGroup
