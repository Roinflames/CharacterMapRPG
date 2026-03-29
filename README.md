# Character Map (UI v0.36.9)

Proyecto frontend de personaje sobre mapa con colisiones, rutas, hitos RPG, inventario, experiencia/niveles y formación de equipo. Esta versión agrega el pipeline Unity para combate, retratos por asset pack y progresión con respawn de hitos.

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

Guía paso a paso: `docs/RENDER.md`.

## Frente Unity (Battle Core)

Se inicio la migracion de combate solido hacia Unity con soporte de canon externo:

- Plan: `docs/world-anvil-unity-plan.md`
- Plantilla de canon para World Anvil: `docs/world-anvil-template.md`
- Battle Core inicial C#: `unity/BattleCore/`
- Portrait pack de combate (Assets/Resources/Portraits/pack)
- Generador de placeholders: `unity/BattleCore/Editor/PortraitPlaceholderGenerator.cs`
- Pipeline de assets: `unity/BattleCore/PortraitAssetLibrary.cs` + `PortraitPainter.cs`
- Control de progresión: respawn y bloqueo de jefe por nivel desde `GameSession.cs`
- Retratos y encuentros se cargan en `BattleDriver.cs`

## Historial de versiones

- `v0.36.9`: protagonista ahora usa sprite 8-bit (caballerito) y movimiento tipo Pokemon (mantener tecla para avanzar; facing se conserva incluso si la casilla esta bloqueada).
- `v0.36.0`: enfoque combat-centric: nuevo boton `Buscar combate` (entra directo al enemigo mas cercano), encadenado automatico de peleas tras cada victoria y AI enemiga en mapa mas agresiva (persecucion mas rapida y con mayor alcance). Incluye buff leve de vida base del jugador para pruebas (`24 -> 30 HP`).
- `v0.36.1`: perfiles de confianza por enemigo: cada tipo (calmado/agresivo/erratico/balanceado) ajusta ganancia/decay/volatilidad para que la impaciencia sea distintiva sin romper el mecanismo global.
- `v0.36.2`: fuerza el ataque solo después del timeout duro (`7s`), evitando que los enemigos se desaten en cadena; el `threshold` sigue siendo aviso, pero la ejecución requiere inactividad real.
- `v0.36.3`: ajusto la IA para que solo persiga dentro de un rango moderado (5-7 pasos según amenaza) y reduzco la frecuencia del movimiento (640ms) para que no se acumulen todos sobre ti.
- `v0.36.4`: limites de persecucion por enemigo: solo dos enemigos pueden perseguirte simultaneamente y cada uno necesita un cooldown de ~2.2s antes de volver a iniciar el chase; ayuda a mantener combates manejables sin reducir agresividad.
- `v0.36.5`: la cadena automática requiere que el jugador se mueva entre combates; si no lo haces, no se activa y el botón “Buscar combate” queda como única forma de reactivar el siguiente duelo, evitando que te salten sin moverte.
- `v0.36.6`: desactivo el modo “combat focus” automático (COMBAT_FOCUS_MODE=false) porque el mapa no estaba sincronizando la cadena: ahora solo el botón “Buscar combate” inicia peleas/resetea la IA mientras exploras.
- `v0.36.7`: agrupo rutas en mundos con entrada compartida, indicando el mundo en el HUD y haciendo que cada mundo arranque siempre en el mismo punto (ej: rutas 1-3 inician en `1,1`); los warps lineales y los bosses están listos para usarse durante esa progresión.
- `v0.36.8`: ajusté la dificultad global de enemigos (HP ×1.22 y daño ×1.18) para que los combates se sientan más aguerridos sin tocar el loop de combate; el balance se aplica automáticamente a rutas existentes y generadas.
- `v0.35.8`: confianza enemiga con gradualidad por racha de ataques: cada ataque del enemigo sube una volatilidad (`Ritmo`) que acelera tanto la ganancia como la perdida de confianza; HUD de combate actualizado para mostrar ese ritmo junto al castigo por inactividad.
- `v0.35.7`: IA de confianza enemiga en combate por inactividad del jugador: indicador visible en HUD (`Confianza enemiga` + countdown), crecimiento por contexto (amenaza/etapa/ventaja HP) y ataque automatico al llegar al umbral o timeout duro de inactividad.
- `v0.35.6`: balance de etapas y progreso RPG: amenaza/niebla ahora escalan por etapa (transiciones mas claras), nuevo indicador visible `Etapa X/3` con bonus activo, bonus temporal por etapa en stats (+ATQ/DEF/HP) y recompensas de entrada por etapa (`HP + esencia`, una vez por run/ruta), con layout debug ajustado para mobile.
- `v0.35.5`: controles debug visibles para etapas del mundo (`Etapa -`, `Etapa +`, `Etapa real`) con bloqueo en combate/lore y mensaje de transicion por etapa.
- `v0.35.4`: modal debug extendido con `Salto ruta/mundo`: selector dinamico de rutas (1-13) + boton `Ir ruta`, con bloqueo en combate y transicion limpia desde lore a modo juego.
- `v0.35.3`: hotfix adicional `Salto nivel`: ahora usa seteo exacto de nivel (subir y bajar) reconstruyendo stats desde base, con mensaje de confirmacion `nivel anterior -> nivel nuevo`.
- `v0.35.2`: hotfix `Salto nivel`: ahora aplica subida por ajuste directo de nivel/atributos (sin depender de bucle de EXP), recarga HP al maximo y refresca stats/estado al instante.
- `v0.35.1`: `Salto nivel` reparado: overlay debug funcional en UI (abrir/cerrar/aplicar), validacion de rango (1-99), bloqueo durante combate/lore y aplicacion por nivel objetivo con Enter o boton.
- `v0.35.0`: terror reforzado en exploracion (`Dark Brutal`): pulso de amenaza en todas las rutas, stingers graves aleatorios al acercarte a enemigos, camara con deriva tensa por nivel de amenaza, niebla mas cerrada en `high/critical` y feedback visual de panic/flicker en el mapa.
- `v0.34.9`: modo visual `Dark Brutal` activado (tema runtime en `body[data-theme]`, atmosfera del mapa reforzada y estilo UI/paneles/botones ajustado a una direccion mas oscura y agresiva).
- `v0.34.8`: aullido de lobo en preset mas oscuro tipo Castlevania (base chip agresiva, ruido controlado y cola con eco grave).
- `v0.34.7`: aullido de lobo extendido (cola mas larga y caida mas lenta) para lectura mas natural de lobo y menos efecto corto.
- `v0.34.6`: aullido de lobo llevado a tono mas feral (dual garganta aspera + capa de aliento rugoso + yelp final), reduciendo caracter de silbido musical.
- `v0.34.5`: timbre de lobo refinado (menos grave): aullido y grunido con fundamental mas alta y recorte de bajos para evitar sonido tipo elefante.
- `v0.34.4`: audio de lobo agregado: aullido al iniciar combate contra Lobo Sombrio y grunido corto en su turno enemigo.
- `v0.34.3`: rollback visual de enemigos: 3D experimental desactivado por defecto para priorizar claridad del retrato 2D hasta tener modelos/texturas de mayor calidad.
- `v0.34.2`: mejoras de animacion 3D en enemigos: idle con respiracion/balanceo, reaccion de impacto, embestida en turno enemigo y soporte de clips GLB si el modelo trae animaciones.
- `v0.34.1`: latidos de amenaza habilitados en todas las rutas (ya no quedan restringidos a Ruta 1).
- `v0.33.11`: SFX de ataque redisenado a golpe fisico (thump grave + crack agudo + burst de ruido corto) para mayor sensacion de impacto.
- `v0.33.10`: hotfix retrato de combate: al abrir modal fuerza vista 2D por defecto y reduce opacidad de capa blur para evitar pantallas borrosas/pixeladas.
- `v0.33.9`: tuning visual del POC 3D (camara/luces/fondo) y ocultamiento de capa blur al activar 3D para evitar resultado borroso.
- `v0.33.8`: POC enemigo 3D en combate sin Unity (Three.js + GLTFLoader con modelos GLB locales), con fallback automatico a retrato 2D si no hay soporte o falla la carga.
- `v0.33.7`: integracion visual de Mini Dungeon (CC0) en el mapa: `character-orc` para hitos pendientes, `chest` para hitos completados y `gate` para la meta con fallback al render clasico.
- `v0.33.6`: flujo de mochila integrado al combate: boton `Item` abre inventario rapido y al usar un objeto se cierra overlay y continua turno correctamente.
- `v0.33.5`: botones de combate en mobile vuelven a formato horizontal (3 columnas) para reducir altura del modal y mejorar lectura tactil.
- `v0.33.4`: layout responsive real en mobile/tablet/desktop (sin ancho minimo rigido, columnas apiladas y overlay de inventario/combate adaptados a pantallas pequenas).
- `v0.33.3`: retratos de Ruta 3 reemplazados por emblemas tipo logo (sin rostros) para mantener estilo decorativo y legible.
- `v0.33.2`: atajo debug `L` para subir 1 nivel instantaneo durante pruebas (otorga EXP faltante al siguiente nivel).
- `v0.33.0`: nueva `Ruta 3` jugable con jefe final (`Soberano del Abismo`) y flujo de historia extendido (Ruta 2 ahora desbloquea Ruta 3 al pisar meta dorada con hitos completos).
- `v0.32.2`: fases visuales habilitadas en todas las rutas (ya no se quedan en estado neutral fuera de Ruta 1, incluida etapa 3).
- `v0.32.1`: fix IA enemigos: persecucion solo con linea de vision real (ya no detectan/ven al jugador a traves de muros).
- `v0.31.9`: motivo musical del Mundo 1 con variantes A/B/C (`M1-A`, `M1-B`, `M1-C`) para comparar estilo desde el selector Exterior.
- `v0.31.8`: melodias complejizadas con arreglos en capas (lead, armonia, bajo y acentos ritmicos) y variacion por compas/estado.
- `v0.31.7`: pulso de amenaza rediseñado a latido tipo corazon (`lub-dub`) con tono grave y respuesta por nivel de amenaza.
- `v0.31.6`: presencia enemiga endurecida: ecos solo al moverte, menor radio y menor intensidad para evitar localizar enemigos sin explorar.
- `v0.31.5`: inventario rapido iniciado en overlay tipo libro (base estructural para experiencia en misma pantalla).
- `v0.31.4`: deteccion de enemigos ajustada para mayor tension: revelado en dos etapas (eco tenue y revelado completo) y menor rango de ecos de presencia.
- `v0.31.2`: hotfix de visibilidad en niebla: hitos se revelan antes, centro de vision mas claro y marcadores enemigos dibujados sobre la niebla.
- `v0.31.1`: Mundo 1 con cambio visual mucho mas marcado por fases (corrupto/fracturado/purificado), atmosfera global reactiva y HUD con estado del mundo.
- `v0.31.0`: Mundo 1 inmersivo completo: niveles de amenaza en tiempo real, ecos de presencia enemiga en mapa, pulso sonoro reactivo y transicion visual al entrar en combate.
- `v0.30.6`: control manual temporal de fase visual en Mundo 1 para afinar direccion artistica (`[` baja, `]` sube, `0` vuelve a progreso real).
- `v0.30.5`: terreno visual renovado con variacion procedural por tile (texturas, sombras y meta con brillo) para eliminar aspecto tipo ajedrez.
- `v0.30.4`: selector de versiones para tema exterior (V1/V2/V3) y opcion de componer melodia personalizada por notas (guardada en localStorage).
- `v0.30.3`: tempo de musica en batalla acelerado con pulso grave adicional para un feel mas metal (riff mas agresivo en combate).
- `v0.30.1`: hotfix de audio web (desbloqueo por gesto global, volumen base de BGM reforzado y feedback cuando el navegador bloquea audio).
- `v0.30.0`: audio web activado con BGM/SFX procedural, control de mute y slider de volumen en la UI.
- `v0.29.1`: salida del prólogo reforzada (clic/Enter/Espacio para continuar) y mejora de contraste/legibilidad del botón de avance en lore.
- `v0.29.0`: se integra el frente Unity (Battle Core) con canon externo, pipeline de retratos por asset pack y progresion con respawn de hitos.
- `v0.28.0`: niebla de guerra en el mapa (vision limitada alrededor del jugador) y ocultamiento tactico de hitos/meta fuera de rango.
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
