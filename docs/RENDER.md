# Deploy en Render

Este proyecto es un frontend estático. Puedes desplegarlo en Render de 2 formas.

## Opción A (recomendada): Render + Docker (nginx)

El repo incluye `Dockerfile` que sirve el juego con `nginx` en puerto `80`.

1. En Render: **New → Web Service**
2. Conecta el repo `Roinflames/CharacterMapRPG`
3. Environment: **Docker**
4. Branch: `main`
5. Deploy

Notas:
- No requiere variables de entorno.
- Health check: `/`

### Blueprint (opcional)
Existe `render.yaml` para crear el servicio como blueprint.

## Opción B: Render Static Site

1. En Render: **New → Static Site**
2. Build command: vacío
3. Publish directory: `.`
4. Deploy

