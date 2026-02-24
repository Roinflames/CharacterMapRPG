# Plan World Anvil -> Unity (Battle Core)

## Objetivo

Usar World Anvil como fuente de verdad narrativa y de balance base, y Unity como runtime para combate por turnos solido.

## Fases

1. Fase 1 - Canon y contrato de datos
- Definir plantillas en World Anvil para razas, facciones, enemigos, rutas y jefes.
- Definir JSON canonico que Unity pueda cargar sin transformaciones complejas.
- Criterio de listo: existe `unity/data/canon.schema.json` y `unity/data/canon.sample.json`.

2. Fase 2 - Battle Core en Unity
- Implementar turnos (`StartTurn`, `SelectAction`, `Resolve`, `EndTurn`, `Result`).
- Acciones: `Attack`, `Heal`, `Escape`.
- Criticos con d20, KO y resolucion de victoria/derrota.
- Criterio de listo: combate 1v1 estable durante 10 simulaciones seguidas sin dobles turnos.

3. Fase 3 - IA y telegraph
- IA por prioridad (HP bajo, oportunidad de KO, riesgo de derrota).
- Mostrar dano previsto antes de confirmar accion.
- Criterio de listo: UI muestra dano previsto y el log refleja la resolucion exacta.

4. Fase 4 - Integracion de progreso
- EXP, nivel, loot, invocaciones y jefe obligatorio de nivel 3.
- Criterio de listo: nivel 3 dispara boss fight y no permite avanzar sin derrotarlo.

## Decisiones de diseno

- World Anvil define contenido y tuning base.
- Unity calcula combate en runtime y no depende de internet.
- El JSON exportado se versiona en git para trazabilidad.

## Riesgos y mitigacion

- Riesgo: drift entre lore y gameplay.
  Mitigacion: campos obligatorios con schema y validacion antes de commit.
- Riesgo: balance inconsistente.
  Mitigacion: tabla de rangos por nivel en World Anvil y test de simulacion.

## Hito inmediato (activo)

- Completar Fase 1 con plantilla + schema + ejemplo de boss nivel 3.
