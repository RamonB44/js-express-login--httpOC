const { SerialPort } = require('serialport')

const port = new SerialPort({ path: 'COM3', baudRate: 115200 }, function (err) {
    if (err) {
        return console.log('Error: ', err.message)
    }
})

const { ReadyParser } = require('@serialport/parser-ready')

const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')

// const parser = port.pipe(new ReadyParser({ delimiter: '\n' }))
const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }))

module.exports = parser;