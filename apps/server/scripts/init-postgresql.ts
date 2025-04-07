const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config() // 添加dotenv支持

const dbConfig = {
    user: process.env.postgresql_username,
    host: process.env.postgresql_host,
    database: 'postgres', // 连接默认数据库
    password: process.env.postgresql_password,
    port: parseInt(process.env.postgresql_port),
}

const sqlDir = path.join(__dirname, '../database')
// 需要注意，这里的sql文件顺序不能乱排。
const sqlFiles = [
    'action.sql',
    'menu.sql',
    'subject.sql',
    'permission.sql',
    'role.sql',
    'role_permissions.sql',
    'user.sql',
    'user_roles.sql',
    'project.sql',
    'tracking.sql',
    'tracking_datasource.sql',
]

async function createDatabase() {
    const client = new Client(dbConfig)
    try {
        await client.connect()
        await client.query(`CREATE DATABASE ${process.env.postgresql_database}`)
        console.log(`数据库 ${process.env.postgresql_database} 创建成功`)
        return true
    } catch (err) {
        if (err.message.includes('already exists')) {
            console.log(`数据库 ${process.env.postgresql_database} 已存在，跳过数据库初始化`)
            return false
        } else {
            throw err
        }
    } finally {
        await client.end()
    }
}

// 执行SQL文件
async function runSqlFiles() {
    const client = new Client(dbConfig)

    try {
        await client.connect()
        console.log('数据库连接成功')

        for (const file of sqlFiles) {
            const filePath = path.join(sqlDir, file)
            const sql = fs.readFileSync(filePath, 'utf8')

            console.log(`正在执行: ${file}`)
            await client.query(sql)
            console.log(`执行完成: ${file}`)
        }

        console.log('所有SQL文件执行完毕')
    } catch (err) {
        console.error('执行SQL出错:', err)
    } finally {
        await client.end()
    }
}

async function main() {
    const isNewDatabase = await createDatabase()
    if (!isNewDatabase) {
        return
    }
    //切换数据库
    dbConfig.database = process.env.postgresql_database
    runSqlFiles()
}
main()
