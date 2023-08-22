const path = require('path')
const { existsSync, mkdir, rmSync, mkdirSync } = require('fs')

const repeatText = require('./repeatText.js')
const repeatFileAndWriteToGZIP = require('./repeatFileAndWriteToGZIP.js')

const targetRepeatFileSize = 1 * 1024 * 1024 * 1024 // 1GB

const text = 'Text '
const outputDir = '/output/'
const outputPath = path.join(process.cwd(), outputDir)
const outputRepeatTextPath = path.join(outputPath, 'repeatText.txt')
const outputRepeatFilePath = path.join(outputPath, 'repeatFile.txt.gz')

const Main = async () => {
	console.log('RepeatText Start')
	console.time('RepeatText')
	repeatText(outputRepeatTextPath, text, targetRepeatFileSize)
	console.timeEnd('RepeatText')

	console.log('RepeatFileAndWriteToGZIP Start')
	console.time('RepeatFileAndWriteToGZIP')
	await repeatFileAndWriteToGZIP(
		outputRepeatTextPath,
		outputRepeatFilePath,
		100
	)
	console.timeEnd('RepeatFileAndWriteToGZIP')
}

if (existsSync(outputPath)) rmSync(outputPath, { recursive: true })

mkdirSync(outputPath, { recursive: true })

Main()
