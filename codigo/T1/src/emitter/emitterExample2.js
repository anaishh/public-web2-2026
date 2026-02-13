import {EventEmitter, once} from 'node:events'

const emisor = new EventEmitter();

async function esperarEvento () {
  console.log('Esperando evento');
  const [mensaje] = await once(emisor,'saludo');
  console.log('Mensaje recibido:', mensaje);
}

esperarEvento();
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
setTimeout(()=>emisor.emit('saludo', 'Buenos días'), 2000);
console.log('Fin del hilo sincrono');