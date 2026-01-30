# 📦 Ejercicio T1: Package Analyzer CLI

## La Herramienta del Desarrollador Curioso

Crea una herramienta CLI que analice proyectos Node.js y genere un informe sobre sus dependencias.

**Nivel:** ⭐⭐ Intermedio | **Tiempo:** 20-25 min

## 📖 Historia

Eres el nuevo DevOps de una empresa y te piden crear una herramienta que analice los `package.json` de múltiples proyectos para detectar dependencias desactualizadas, duplicadas o potencialmente problemáticas.

## 📋 Requisitos

### 1. Leer el package.json del directorio actual o uno especificado

```bash
node src/analyzer.js                    # Analiza ./package.json
node src/analyzer.js /path/to/project   # Analiza path especificado
```

### 2. Mostrar información del proyecto

- Nombre y versión
- Cantidad de dependencias (prod vs dev)
- Scripts disponibles

### 3. Analizar dependencias

- Listar todas con sus versiones
- Detectar si usan ^ o ~ o versión fija
- Identificar dependencias con @ en el nombre (scoped)

### 4. Generar informe

- Output formateado en consola con colores (opcional)
- Guardar resumen en `analysis-report.json`

## 🎯 Criterios de éxito

- [ ] Usa ESM (import/export)
- [ ] Lee argumentos con `process.argv`
- [ ] Usa `node:fs/promises` para leer/escribir
- [ ] Usa `node:path` para rutas multiplataforma
- [ ] Maneja errores (archivo no existe, JSON inválido)
- [ ] Genera el archivo de reporte

## 🎁 BONUS

1. Mostrar el tamaño de node_modules si existe
2. Comparar versiones de Node requerida vs actual
3. Añadir colores al output con códigos ANSI

## Ejecutar solución

```bash
cd ejercicios/T1
node src/analyzer.js
node src/analyzer.js ../../codigo/T5
```
