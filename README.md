# Character Map (UI v0.4.0)

Proyecto frontend simple de un personaje que se mueve por un mapa con colisiones, hitos de ruta y enfrentamientos RPG por turnos.

## Correr local

### Opción 1: Python

```bash
cd /home/rreyes/projects/labs/character-map-v0.1.0
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

### Opción 2: Docker

```bash
cd /home/rreyes/projects/labs/character-map-v0.1.0
docker compose up --build
```

Abrir `http://localhost:8080`.

## Variables de entorno

No requiere variables de entorno para esta versión.

## Deploy

Render Static Site:

- Build command: vacío
- Publish directory: `.`

También se puede desplegar como contenedor con el `Dockerfile` incluido.

## Historial de versiones

- `v0.4.0`: selector de rutas y nueva Ruta 2 con mapa e hitos RPG propios.
- `v0.3.0`: hitos convertidos en enfrentamientos RPG, sistema de HP, combate por turnos y progreso de ruta.
- `v0.1.0`: mapa base, personaje movible, colisiones, meta y controles táctiles.
