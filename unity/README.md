# Unity Battle Core (Inicio)

Este directorio contiene el arranque del combate por turnos para migracion a Unity.

## Archivos

- `BattleCore/BattleTypes.cs`: tipos base (fases, acciones, snapshot, resolucion).
- `BattleCore/BattleEngine.cs`: logica de turnos, d20 critico, dano, cura, escape y KO.
- `BattleCore/EnemyAiPolicy.cs`: IA basica por prioridad.
- `data/canon.schema.json`: contrato de datos para canon exportado desde World Anvil.
- `data/canon.sample.json`: ejemplo con jefe obligatorio de nivel 3.

## Integracion rapida en Unity

1. Crear proyecto Unity (URP opcional).
2. Copiar `unity/BattleCore/*.cs` dentro de `Assets/Scripts/BattleCore/`.
3. Copiar `unity/BattleCore/Editor/BattleSceneGenerator.cs` dentro de `Assets/Scripts/BattleCore/Editor/`.
4. En Unity, ejecutar menu `Character Map RPG -> Create Battle Scene`.
5. Abrir `Assets/Scenes/BattleScene.unity` y presionar `Play`.

El generador crea automaticamente:
- Canvas y EventSystem
- Textos de HP/turno/preview/resultado/log
- Botones Atacar/Curar/Escapar
- GameObject `BattleDriver` con referencias ya conectadas

## Regla clave

El jefe de nivel 3 debe configurarse con `escapeAllowed=false` y bloqueo de progreso.
