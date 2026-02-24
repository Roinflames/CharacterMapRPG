# Plantilla World Anvil (Canon de Combate)

Usa esta estructura por cada entidad. Mantener IDs estables.

## 1) Raza

- `id`: string unico (`humano`, `elfo`, etc.)
- `nombre`: string
- `color_hex`: string
- `estilo`: `fisico` | `magico`
- `faccion_base`: `cielo` | `infierno` | `neutral`
- `rasgo_pasivo`: texto corto
- `domina_todas`: bool
- `dificil_de_ocupar`: bool

## 2) Faccion

- `id`: string unico
- `nombre`: string
- `fantasia`: descripcion corta
- `bonus_global`: objeto (`atk`, `def`, `hp`, `crit_mod`)

## 3) Enemigo

- `id`: string unico
- `nombre`: string
- `raza_id`: referencia a raza
- `rol`: `bruiser` | `caster` | `assassin` | `tank` | `support` | `boss`
- `stats_base`: objeto (`hp`, `atk`, `def`, `speed`, `crit_resist`)
- `habilidades`: lista de IDs
- `loot_table_id`: string
- `portrait_key`: string

## 4) Habilidad

- `id`: string unico
- `nombre`: string
- `tipo`: `ataque` | `cura` | `buff` | `debuff` | `invocacion`
- `escala`: `atk` | `mag` | `fijo`
- `potencia`: numero
- `coste`: objeto opcional (`mana`, `cd_turns`)
- `efectos`: lista (ej. `burn`, `bleed`, `shield`)

## 5) Ruta

- `id`: string unico (`route1`, `route2`)
- `nombre`: string
- `nivel_recomendado`: numero
- `hitos`: lista ordenada de IDs de encuentro

## 6) Encuentro/Hito

- `id`: string unico
- `route_id`: referencia
- `orden`: numero
- `enemy_id`: referencia
- `es_jefe`: bool
- `recompensas`: objeto (`exp`, `essence`, `loot_table_id`)
- `reglas`: objeto opcional (`escape_permitido`, `turn_limit`)

## 7) Regla global de nivel 3 (obligatoria)

- Existe un encuentro con `es_jefe: true`.
- `trigger`: al alcanzar nivel 3.
- `escape_permitido`: false.
- `bloquea_progreso`: true hasta derrotar jefe.
