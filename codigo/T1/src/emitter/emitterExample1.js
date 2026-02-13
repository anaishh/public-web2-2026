import { EventEmitter } from "node:events";

const emisor = new EventEmitter();

emisor.on('saludo', (data)=> console.log('recibido evento miEvento ', data));
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
