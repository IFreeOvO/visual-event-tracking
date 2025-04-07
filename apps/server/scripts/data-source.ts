import * as fs from 'node:fs'
import { join } from 'node:path'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import { ConfigEnum } from '../src/constants/config.constant'

function parseEnv(env: string): Record<string, unknown> {
    const path = join(__dirname, '../', env)
    if (fs.existsSync(path)) {
        return dotenv.parse(fs.readFileSync(path))
    }
    return {}
}

function getEnv() {
    const baseConfig = parseEnv('.env')
    const envConfig = parseEnv(`.env.${process.env.NODE_ENV || 'development'}`)
    const localConfig = parseEnv('.env.local')

    return {
        ...baseConfig,
        ...envConfig,
        ...localConfig,
    }
}

const config: Record<string, any> = getEnv()

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: config[ConfigEnum.POSTGRESQL_HOST],
    port: config[ConfigEnum.POSTGRESQL_PORT],
    username: config[ConfigEnum.POSTGRESQL_USERNAME],
    password: config[ConfigEnum.POSTGRESQL_PASSWORD],
    database: config[ConfigEnum.POSTGRESQL_DATABASE],
    migrations: [join(__dirname, '../migrations/**')],
    entities: [join(__dirname, '../src/modules/**/entities/*.entity.ts')],
}

export default new DataSource(dataSourceOptions)
