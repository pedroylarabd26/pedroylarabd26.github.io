function actualizarContador() {
    const objetivo = new Date("2026-10-17T12:00:00");
    const ahora = new Date();
    const diferencia = objetivo - ahora;

    if (diferencia <= 0) {
        document.querySelector(".countdown").innerHTML = "¡Hoy es el gran día!";
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("days").textContent = dias;
    document.getElementById("hours").textContent = horas;
    document.getElementById("minutes").textContent = minutos;
    document.getElementById("seconds").textContent = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();
