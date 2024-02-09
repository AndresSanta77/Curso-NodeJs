/* APLICACIÓN PARA SABER LOS RECURSOS DEL PC */

const os = require('node:os')

console.log('información del sistema operativo')
console.log('_________________________________')

console.log('Nombre del sistema operativo  ', os.platform())
console.log('Version del sistema operativo ', os.release())
console.log('Arquitectura ', os.arch())
console.log('CPUs ', os.cpus())
console.log('Memoria libre ', os.freemem() /1024 / 1024)
console.log('Memoria total ', os.totalmem() /1024 / 1024)
console.log('uptime ', os.uptime() /60 / 60)