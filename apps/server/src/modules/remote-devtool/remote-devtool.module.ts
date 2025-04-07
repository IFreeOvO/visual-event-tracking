import { Module } from '@nestjs/common'
import { RemoteDevtoolGateway } from './remote-devtool.gateway'
import { RemoteDevtoolService } from './remote-devtool.service'

@Module({
    providers: [RemoteDevtoolGateway, RemoteDevtoolService],
})
export class RemoteDevtoolModule {}
