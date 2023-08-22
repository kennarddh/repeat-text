const fs = require('fs')
const stream = require('stream')
const { createGzip } = require('node:zlib')

async function* concatStreams(readables) {
	for (const { index, stream: readable } of readables) {
		console.log({ currentStreamIndex: index })
		console.time(`Chunk ${index}`)

		for await (const chunk of readable) {
			yield chunk
		}

		console.timeEnd(`Chunk ${index}`)
	}
}
const repeatFileAndWriteToGZIP = async (input, output, count) => {
	const readStreams = Array(count)
		.fill(null)
		.map((_, index) => ({
			index,
			stream: fs.createReadStream(input),
		}))

	const iterable = await concatStreams(readStreams)

	// convert the async iterable to a readable stream
	const mergedStream = stream.Readable.from(iterable)

	const gzip = createGzip()
	const destination = fs.createWriteStream(output)

	// await new Promise(resolve => gzip.once('end', () => resolve()))

	new Promise(resolve =>
		stream
			.pipeline(mergedStream, gzip, destination, err => console.log(err))
			.on('finish', () => resolve())
	)
}

module.exports = repeatFileAndWriteToGZIP
