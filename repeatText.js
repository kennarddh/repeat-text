const fs = require('fs')

const repeatText = (output, text, targetSize) => {
	const drainChunkSize = 100 * 1024 * 1024 // 100MB
	const count = Math.floor(targetSize / text.length)
	const writeChunkCount = Math.floor(drainChunkSize / text.length)
	const chunkCount = Math.floor(count / writeChunkCount)
	const chunkLeftCount = Math.floor(
		((count / writeChunkCount - chunkCount) * drainChunkSize) / text.length
	)

	console.log({ chunkCount })

	console.log('Pre computing chunk text')
	let preComputedText = ''

	for (let i = 0; i < writeChunkCount; i++) {
		preComputedText += text
	}

	console.log('Appending pre computed chunk text')
	for (let i = 0; i < chunkCount; i++) {
		console.log(`Appending pre computed chunk text ${i}`)
		fs.appendFileSync(output, preComputedText)
	}

	console.log('Pre computing left text')
	let preComputedLeftText = ''

	for (let i = 0; i < chunkLeftCount; i++) {
		preComputedLeftText += text
	}

	console.log('Appending pre computed left text')
	fs.appendFileSync(output, preComputedLeftText)

	console.log('Checking size')
	const resultSize = fs.statSync(output).size
	console.log('Checking size done')

	console.log({ writeChunkCount, chunkLeftCount, resultSize, targetSize })
}

module.exports = repeatText
