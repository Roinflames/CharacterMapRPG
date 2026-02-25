# Immersion Design Guide

Guia de diseno para elevar inmersion antes de implementar logica compleja.

## Objetivo

Lograr que el jugador sienta presencia, riesgo y atmosfera viva en mapa, sin depender solo del combate.

## Principios base

- `diegético primero`: la informacion importante debe venir del mundo (luz, sonido, siluetas, rastro), no solo de texto.
- `lectura en 2 segundos`: jugador debe entender zona segura/peligro de un vistazo.
- `progresion visible`: el mundo cambia con el avance (corrupcion/purificacion).
- `consistencia`: cada enemigo/tipo debe tener un lenguaje visual y sonoro propio.

## Capas de inmersion

### 1) Ambiente (pasivo)

- Niebla con variacion sutil en movimiento.
- Parallax leve en fondo y luz volumetrica.
- Particulas ambientales por mundo (ceniza, esporas, polvo, chispas).
- Paleta por mundo con 1 color dominante + 1 color de peligro.

### 2) Presencia enemiga (anticipacion)

- Siluetas parciales de enemigos en borde de vision.
- Huellas/rastros temporales cuando enemigo patrulla.
- Audio de proximidad (drone, latido, respiracion) segun distancia.
- Distorsion visual breve al entrar en radio de amenaza.

### 3) Contacto (transicion a combate)

- Pulso de pantalla + micro zoom + oscurecimiento selectivo.
- Nombre/arquetipo enemigo aparece con etiqueta de color.
- Cambio musical escalonado (mapa -> tension -> combate).

## Sistema visual de amenaza (propuesto)

- `Bajo`: tonos frios, sin warning.
- `Medio`: viñeta leve + pulso sonoro lento.
- `Alto`: bordes calidos, latido acelerado, sombras activas.
- `Critico`: destello breve + lock visual al objetivo.

## Lenguaje por arquetipo

- `Arquero`: telemetria fina, destellos lineales, color verde.
- `Tanque`: pasos pesados, vibracion corta, color rojo oscuro.
- `Mago`: ruido espectral, bloom suave, color cian/violeta.
- `Asesino`: apariciones fragmentadas, audio seco, color umbrio.

## Mundo 1 (primer objetivo)

- Estado inicial: frio, opresivo, poca luz calida.
- A mitad de hitos: surgen lineas doradas y claridad parcial.
- Cierre de ruta: purificacion visible (menos niebla, mas contraste limpio).

## HUD inmersivo (sin saturar)

- Mantener UI minima en exploracion.
- Priorizar feedback en mundo sobre mensajes largos.
- Solo 1 mensaje de peligro activo a la vez.

## Checklist de implementacion por fases

### Fase A (diseno visual, sin IA enemiga)

- [ ] Definir paleta final por mundo.
- [ ] Definir 3 niveles de amenaza visual.
- [ ] Definir transicion mapa -> combate.
- [ ] Test de legibilidad desktop/mobile.

### Fase B (prototipo inmersivo)

- [ ] Añadir audio de proximidad basico.
- [ ] Añadir siluetas de presencia enemiga.
- [ ] Añadir evento visual de deteccion.

### Fase C (experiencia jugable)

- [ ] Patrulla + deteccion + persecucion.
- [ ] Ajuste fino de tiempos y fatiga visual.
- [ ] Balance de frecuencia de encuentros.
