import { PartialType } from '@nestjs/mapped-types'
import { CreateRemoteDevtoolDto } from './create-remote-devtool.dto'

export class UpdateRemoteDevtoolDto extends PartialType(CreateRemoteDevtoolDto) {
    id: number
}
