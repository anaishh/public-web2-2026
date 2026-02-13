import {EventEmitter, once} from 'events'

const emisor = new EventEmitter();

async function esperarEventoConTimeout() {
  const controller = new AbortController();
  const {signal} = controller
  setTimeout(()=> controller.abort(), 3000);

  try {
    const [mensaje] = await once(emisor, 'saludo', {signal});
    console.log("Saludo recibido:", mensaje);
  } catch (e) {
    if (e.name=='AbortError')
      console.log('tiempo agotado');
  }
  
}

esperarEventoConTimeout();
setTimeout(()=>emisor.emit('saludo', 'Buenos dias'), 3500);


