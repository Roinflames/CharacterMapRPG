# Corrupción (secreta)

Sistema de alineamiento oculto para **Character Map RPG**.

## Objetivo
- Que el jugador sienta consecuencias “morales” en la run sin ver un número.
- Que decisiones positivas/negativas acumulen una variable secreta y recién se revele al final.

## Rango
- `corrupcion` ∈ **[-100, 100]**
  - `-100` = purificación máxima (luz)
  - `0` = ambivalente / humano
  - `100` = corrupción máxima (caída)

## Regla de secreto
- `corrupcion` **no se muestra** en UI durante la run.
- Solo se comunica por *sensaciones* y *señales ambientales* (texto, audio, niebla, color).

## Modificación (deltas)
Usa cambios chicos y medianos. Guía:
- Micro: `±1..±3` (flavor, diálogo, loot menor)
- Media: `±4..±8` (decisión clara en un hito)
- Grande: `±9..±15` (pacto, traición, sacrificio)

Reglas:
- Nunca sumar más de `±15` en un solo evento.
- Clamp: siempre mantener `corrupcion` dentro de [-100, 100].

## Señales ambientales (sin revelar el número)

Señales de **alta corrupción** (corrupcion > 40):
- Niebla más densa / oscura.
- UI más rojiza, golpes con stingers más frecuentes.
- Log: “un frío te atraviesa”, “la sombra te reconoce”.

Señales de **purificación** (corrupcion < -40):
- Niebla más clara.
- UI más dorada, curación “se siente” más potente.
- Log: “respiras mejor”, “la ruta se despeja”.

## Efectos sugeridos (sin tocar backend “core”)
No hace falta cambiar la lógica base del combate. Ajustes “de capa”:
- Exploración: intensidad de niebla, pulso de amenaza, pequeños shakes.
- Loot: variar probabilidades / texto de “bendito vs maldito”.
- Combate: colores de feedback (crítico = oro vs rojo), pequeños debuffs/buffs ocultos.

## Revelación final (final de run)
Al terminar una ruta final (o epílogo), mostrar:
1) Resultado: **Purificado / Ambiguo / Caído**
2) Score final: `corrupcion = X`
3) “3 decisiones clave” (lista de eventos que más movieron el score)

Thresholds recomendados:
- `corrupcion <= -60` → Purificado
- `-59..59` → Ambiguo
- `corrupcion >= 60` → Caído

## Tracking de decisiones (recomendado)
Guardar historial con:
- `id` del evento
- `delta`
- `texto` (lo que se mostró al jugador)
- `timestamp` / `ruta`

Esto permite el resumen final sin exponer el sistema durante la run.

