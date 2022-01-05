const listen = document.getElementById('listen');
const items = document.getElementById('items');
const footer = document.getElementById('footer')
const templateCard = document.getElementById("template-card").content;
const templeFotter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded',()=>{
    fetchData();

    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito();
    }
})

listen.addEventListener('click', (e) =>{
    addCarrito(e);
})

items.addEventListener('click', (e) =>{
    btnAccion(e);
})
const fetchData = async ()=>{
    try{
        const res = await fetch('api.json');
        const data = await res.json();
        //console.log(data);
        imprimirElementos(data);

    }catch(error){
        console.log(error)
    }
}   

const imprimirElementos = data =>{
    data.forEach(elemento =>{
        //console.log(elemento)
        templateCard.querySelector('h5').textContent = elemento.title;
        templateCard.querySelector('p').textContent = elemento.precio;
        templateCard.querySelector('img').setAttribute("src",elemento.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id= elemento.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    listen.appendChild(fragment);  
}

const addCarrito = (e) => {
     //console.log(e.target)
     //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
      //console.log(objeto)
    const producto = {
         id: objeto.querySelector('.btn-dark').dataset.id,
         title: objeto.querySelector('h5').textContent,
         precio:objeto.querySelector('p').textContent,
         cantidad: 1,
    } 

    if(carrito.hasOwnProperty(producto.id)){
         producto.cantidad = carrito[producto.id].cantidad+1
    }
     carrito[producto.id]={...producto}
     //console.log(carrito)
     pintarCarrito()
}

const pintarCarrito = ()=>{
    items.innerHTML = '';
     //console.log(carrito);
     Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent= producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
     })
     items.appendChild(fragment);
     pintarFutter();
     
     localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFutter = ()=>{
     footer.innerHTML = '';
    if(Object.keys(carrito).length === 0){
         footer.innerHTML= `
          <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
         `
         return;
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) =>acc + cantidad, 0);
        //console.log(nCantidad)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio }) =>acc + cantidad * precio, 0)
    //console.log(nPrecio)
    templeFotter.querySelectorAll('td')[0].textContent = nCantidad;
    templeFotter.querySelector('span').textContent = nPrecio;
    const clone = templeFotter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito = {};
        pintarCarrito();
    })
}

const  btnAccion = (e)=>{
     //console.log(e.target);
    if(e.target.classList.contains('btn-info')){
         console.log(carrito[e.target.dataset.id])
          //carrito[e.target.dataset.id]
          const producto = carrito[e.target.dataset.id]
          //producto.cantidad = carrito[e.target.dataset.id].cantidad +1;
          producto.cantidad++;
          carrito[e.target.dataset.id] = {...producto};
          pintarCarrito();
    }

    if(e.target.classList.contains('btn-danger')){
        console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
            if(producto.cantidad === 0){
                delete carrito[e.target.dataset.id]
            }
        pintarCarrito();
    }
    e.stopPropagation;
}


