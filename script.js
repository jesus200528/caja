
// BUSCAR LOS ELEMENTOS DEL HTML

const botonAgregarCaja = document.getElementById("agregarCaja");
const contenedorCajas = document.getElementById("cajas");
const contador = document.getElementById("contador");

// CARGAR LAS CAJAS GUARDADAS

let cajas = JSON.parse(localStorage.getItem("cajasDigitales")) || [];

// GUARDAR LOS CAMBIOS

function guardarCajas() {
    localStorage.setItem("cajasDigitales", JSON.stringify(cajas));
}

// MOSTRAR LAS CAJAS EN PANTALLA

function mostrarCajas() {

    contenedorCajas.innerHTML = "";

    contador.textContent = cajas.length;

    // SI NO HAY CAJAS, MOSTRAR UN MENSAJE

    if (cajas.length === 0) {
        contenedorCajas.innerHTML = `
            <p class="vacio">
                Todavía no tienes cajas creadas.
            </p>
        `;
        return;
    }

    // RECORRER TODAS LAS CAJAS

    cajas.forEach(function(caja) {

        const tarjeta = document.createElement("article");
        tarjeta.className = "caja";

        const titulo = document.createElement("h2");
        titulo.textContent = caja.nombre;

        // BOTON PARA AGREGAR NOTA

        const botonNota = document.createElement("button");
        botonNota.textContent = "+ Agregar nota";
        botonNota.className = "agregar-nota";

        botonNota.onclick = function() {
            agregarNota(caja.id);
        };

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(botonNota);

        // MOSTRAR LAS NOTAS DE ESTA CAJA

        caja.notas.forEach(function(nota) {

            const tarjetaNota = document.createElement("div");
            tarjetaNota.className = "nota";

            const contenido = document.createElement("p");
            contenido.textContent = nota.contenido;

            // BOTON EDITAR NOTA

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.className = "editar-nota";

            botonEditar.onclick = function() {
                editarNota(caja.id, nota.id);
            };

            // BOTON BORRAR NOTA

            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.className = "borrar-nota";

            botonBorrar.onclick = function() {
                borrarNota(caja.id, nota.id);
            };

            tarjetaNota.appendChild(contenido);
            tarjetaNota.appendChild(botonEditar);
            tarjetaNota.appendChild(botonBorrar);

            tarjeta.appendChild(tarjetaNota);

        });

        // BOTON PARA BORRAR CAJA

        const botonBorrarCaja = document.createElement("button");
        botonBorrarCaja.textContent = "Eliminar caja";
        botonBorrarCaja.className = "borrar-caja";

        botonBorrarCaja.onclick = function() {
            borrarCaja(caja.id);
        };

        tarjeta.appendChild(botonBorrarCaja);

        contenedorCajas.appendChild(tarjeta);

    });

}

// CREAR UNA CAJA

function agregarCaja() {

    const nombre = prompt("Escribe el nombre de la nueva caja:");

    if (nombre === null || nombre.trim() === "") {
        return;
    }

    const nuevaCaja = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        notas: []
    };

    cajas.push(nuevaCaja);

    guardarCajas();
    mostrarCajas();

}

// AGREGAR UNA NOTA

function agregarNota(idCaja) {

    const contenido = prompt("Escribe el contenido de la nota:");

    if (contenido === null || contenido.trim() === "") {
        return;
    }

    const caja = cajas.find(function(caja) {
        return caja.id === idCaja;
    });

    if (caja) {

        const nuevaNota = {
            id: Date.now().toString(),
            contenido: contenido.trim()
        };

        caja.notas.push(nuevaNota);

        guardarCajas();
        mostrarCajas();
    }

}

// EDITAR UNA NOTA

function editarNota(idCaja, idNota) {

    const caja = cajas.find(function(caja) {
        return caja.id === idCaja;
    });

    if (caja) {

        const nota = caja.notas.find(function(nota) {
            return nota.id === idNota;
        });

        if (nota) {

            const nuevoContenido = prompt(
                "Actualiza el contenido de la nota:",
                nota.contenido
            );

            if (nuevoContenido === null || nuevoContenido.trim() === "") {
                return;
            }

            nota.contenido = nuevoContenido.trim();

            guardarCajas();
            mostrarCajas();
        }
    }

}

// BORRAR UNA NOTA

function borrarNota(idCaja, idNota) {

    const confirmar = confirm("¿Seguro que deseas borrar esta nota?");

    if (!confirmar) {
        return;
    }

    const caja = cajas.find(function(caja) {
        return caja.id === idCaja;
    });

    if (caja) {

        caja.notas = caja.notas.filter(function(nota) {
            return nota.id !== idNota;
        });

        guardarCajas();
        mostrarCajas();
    }

}

// BORRAR UNA CAJA

function borrarCaja(idCaja) {

    const confirmar = confirm(
        "¿Seguro que deseas eliminar esta caja y todas sus notas?"
    );

    if (!confirmar) {
        return;
    }

    cajas = cajas.filter(function(caja) {
        return caja.id !== idCaja;
    });

    guardarCajas();
    mostrarCajas();

}

// ACTIVAR EL BOTON DE CREAR CAJA

botonAgregarCaja.addEventListener("click", agregarCaja);

// MOSTRAR LAS CAJAS AL ABRIR LA PAGINA

mostrarCajas();
