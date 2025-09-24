const usuarioId = "ID_DEL_USUARIO_LOGUEADO"; // Traer dinámicamente desde tu sesión/login

// Cargar equipos y tabla
async function cargarEquipos() {
  const res = await fetch("/equipos");
  const equipos = await res.json();

  const tabla = document.getElementById("tabla-inscripcion");
  tabla.innerHTML = "";

  equipos.forEach(equipo => {
    equipo.autos.forEach(auto => {
      const fila = document.createElement("tr");

      // Logo marca
      const tdMarca = document.createElement("td");
      tdMarca.innerHTML = `<img src="${equipo.logo}" width="50"> ${equipo.marca}`;
      fila.appendChild(tdMarca);

      // Piloto
      const tdPiloto = document.createElement("td");
      tdPiloto.innerText = auto.piloto ? "Ocupado" : "Vacío";
      fila.appendChild(tdPiloto);

      // Auto
      const tdAuto = document.createElement("td");
      tdAuto.innerHTML = `<img src="${auto.foto}" width="100"> ${auto.nombre}`;
      fila.appendChild(tdAuto);

      // Botón inscribirse / salir
      const tdBoton = document.createElement("td");
      const boton = document.createElement("button");

      if (auto.piloto === usuarioId) {
        boton.innerText = "❌ Salir";
        boton.onclick = () => salir(equipo._id);
      } else if (!auto.piloto) {
        boton.innerText = "✔ Inscribirse";
        boton.onclick = () => inscribirse(equipo._id, auto.nombre);
      } else {
        boton.disabled = true;
      }

      tdBoton.appendChild(boton);
      fila.appendChild(tdBoton);

      tabla.appendChild(fila);
    });
  });
}

// Función inscribirse
async function inscribirse(equipoId, autoNombre) {
  await fetch("/equipos/inscribirse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, equipoId, autoNombre })
  });
  cargarEquipos();
}

// Función salir
async function salir(equipoId) {
  await fetch("/equipos/salir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId })
  });
  cargarEquipos();
}

// Inicializar tabla al cargar la página
document.addEventListener("DOMContentLoaded", cargarEquipos);
