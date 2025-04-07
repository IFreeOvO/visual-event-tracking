import { writeFileSync } from 'fs'
import { join } from 'path'
import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator'
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin'

const tsconfigPath = 'tsconfig.build.json'
const srcPath = join(__dirname, '..', 'src')
const metadataPath = join(srcPath, 'metadata.ts')

// 如果本地没有metadata.ts文件，则创建一个默认的。不然这个脚本执行会报错
const defaultContent = `export default async () => { return {}; };`
writeFileSync(metadataPath, defaultContent, 'utf8')

const generator = new PluginMetadataGenerator()
generator.generate({
    visitors: [new ReadonlyVisitor({ introspectComments: true, pathToSource: srcPath })],
    outputDir: __dirname,
    tsconfigPath,
})
