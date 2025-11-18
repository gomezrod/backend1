console.log('usando sockets');
const socket = io();

const entrada = document.querySelector('#entrada');
const listaProductos = document.querySelector('#listaProductos');
const mensajes = document.querySelector('#mensajes');
const cantidadProductos = document.querySelector('#cantidadProductos');


socket.on('listaActualizada', data => {
    const productos = data.map( u => `<li>${u.title}</li>`).join('');
    listaProductos.innerHTML = productos;
    cantidadProductos.innerText = `(${data.length})`;
});


socket.on('nuevoArchivo', data => {
    const listaMensajes = data.map( m => {
        if(m.isLog){
            return `<i>${m.mensaje.nombre}${m.mensaje.mensaje}</i>`;
        }else{
            return `<b>${m.mensaje.nombre}</b>: ${m.mensaje.mensaje}`;
        }
    }).join('<br/><br/>');
    mensajes.innerHTML = listaMensajes;
});
