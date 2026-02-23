# Character Map (UI v0.11.0)

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
