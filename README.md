# Character Map (UI v0.27.9)

Proyecto frontend de personaje sobre mapa con colisiones, rutas, hitos RPG, inventario, experiencia/niveles y formacion de equipo.

## Correr local

### Opcion 1: Python

```bash
cd /home/rreyes/projects/labs/character-map-v0.1.0
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

### Opcion 2: Docker

```bash
cd /home/rreyes/projects/labs/character-map-v0.1.0
docker compose up --build
```

Abrir `http://localhost:8080`.

## Variables de entorno

No requiere variables de entorno para esta version.

## Deploy

Render Static Site:

- Build command: vacio
- Publish directory: `.`

Tambien se puede desplegar como contenedor con el `Dockerfile` incluido.

## Historial de versiones

- `v0.27.9`: al ganar, el retrato enemigo se desvanece completamente antes de cerrar el combate.
- `v0.27.8`: al derrotar un enemigo, el retrato se ilumina y luego se difumina antes de cerrar el combate.
- `v0.27.7`: foco visual en retrato enemigo (menos ruido encima del rostro) y mejora de legibilidad en la zona baja del modal.
- `v0.27.6`: pantalla completa enfocada en el mapa (oculta paneles secundarios y agranda el canvas para jugar).
- `v0.27.5`: animaciones de victoria/derrota reforzadas (más visibles) con efecto adicional en el retrato enemigo.
- `v0.27.4`: animacion de victoria al derrotar un enemigo antes de cerrar el combate.
- `v0.27.3`: titulo del navegador sincronizado con la version actual de UI (`Character Map RPG | UI vX.Y.Z`).
- `v0.27.2`: animacion de derrota antes del reinicio tras perder un combate (transicion mas suave).
- `v0.27.1`: panel "Estimaciones de avance" oculto en la vista de juego.
- `v0.27.0`: ataque previsto visible antes de golpear y descuento de vida gradual en barras HP.
- `v0.26.3`: bloqueo del scroll del navegador al mover el personaje con WASD o flechas.
- `v0.26.2`: correccion de ojos en retratos (el visor de bandido/capitan ya no tapa la mirada) y ajuste de brillo/tamano ocular.
- `v0.26.0`: retratos enemigos rediseñados con estilo mas serio (arquetipos por enemigo, mejor anatomia facial y sombreado cinematografico).
- `v0.25.0`: animacion de respiracion para retratos enemigos en combate, manteniendo el enfoque visual sin cambios de mecanica.
- `v0.24.0`: pipeline de retratos enemigos generado por codigo (variacion por raza/estilo y por enemigo), eliminando recortes defectuosos y manteniendo animaciones de combate.
- `v0.23.0`: rediseño visual del modal de combate (mayor escala, mejor jerarquía tipográfica, barras/acciones más claras y entrada animada).
- `v0.22.0`: limpieza automatica de fondos claros en retratos enemigos (chroma key + cache en runtime) para mejorar la presencia visual en combate.
- `v0.21.1`: parallax del combate ampliado al cuadro completo del modal (incluye zona de botones) con desplazamiento limitado para mejor control.
- `v0.21.0`: retratos enemigos con capa de profundidad/silueta y efectos visuales diferenciados para estilos fisico y magico.
- `v0.20.0`: iluminacion dinamica del modal por faccion y marco animado por raza para reforzar identidad visual de cada enemigo.
- `v0.19.0`: modal de combate con parallax real (fondo en capas + drift ambiental + profundidad en retrato enemigo al mover puntero).
- `v0.17.0`: mejora visual fuerte de enemigos (webp refinado + presentacion de retratos por faccion/raza en combate).
- `v0.16.0`: sistema de equipamiento (arma + armadura) con impacto en ATQ/DEF/HP y bloqueo de cambios durante combate.
- `v0.15.2`: protagonista principal con alias japones en UI (`Jisuo Tenma`) y rol narrativo de portador de la luz.
- `v0.15.1`: narrativa de guerra entre Cielo vs Infierno integrada a historia y combates.
- `v0.15.0`: retratos en webp con tratamiento visual retro para combate.
- `v0.14.2`: atajos de teclado en combate (A atacar, C curar, E escapar).
- `v0.14.1`: layout top-aligned y columna de reclutas compacta con scroll para evitar grandes huecos visuales.
- `v0.14.0`: sistema d20 para golpes criticos/fallo duro en ataques y feedback de tirada en combate.
- `v0.13.2`: boton de pantalla completa para maximizar el juego en sesion de juego.
- `v0.13.1`: cambio bidireccional entre rutas sin perder progreso y opcion de escapar de combate (con probabilidad y riesgo).
- `v0.13.0`: panel de estimaciones de avance con porcentaje y ETA por ruta/total.
- `v0.12.0`: mejora de arte en retratos de enemigos y escenario de combate con estilo visual mas consistente.
- `v0.11.0`: invocaciones entrenables fuera de combate, historial de combate y sistema de 7 razas con 7 colores (fisico/magico y raza dominante dificil de ocupar).
- `v0.9.0`: animaciones de combate por turnos con bloqueo de acciones durante cada ataque/contraataque.
- `v0.8.2`: progresion automatica entre rutas (1 -> 2) y correccion de Ruta 2 para que sea totalmente completable.
- `v0.8.1`: ajuste visual de layout tablet (controles compactos y paneles mas balanceados).
- `v0.8.0`: assets reales de combate (fondo de arena y retratos por enemigo desde `/assets`).
- `v0.7.1`: combate en modal con backdrop y retrato visual del enemigo en cada pelea.
- `v0.7.0`: combate migrado a modal centrado para foco total en enfrentamientos.
- `v0.6.3`: bloque de combate reposicionado arriba de la columna derecha para acceso inmediato.
- `v0.6.2`: layout horizontal tipo tablet con mapa a la izquierda y paneles RPG a la derecha.
- `v0.6.1`: hotfix de layout, el cuadro de juego sube en la pantalla para acceso inmediato.
- `v0.6.0`: panel de stats, experiencia y niveles, y sistema de equipo (reclutar/quitar aliados con bonos de combate).
- `v0.5.0`: inventario con uso y descarte de items, y loot por enfrentamiento.
- `v0.4.0`: selector de rutas y nueva Ruta 2 con mapa e hitos RPG propios.
- `v0.3.0`: hitos convertidos en enfrentamientos RPG, sistema de HP, combate por turnos y progreso de ruta.
- `v0.1.0`: mapa base, personaje movible, colisiones, meta y controles tactiles.
