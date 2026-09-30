# MindMapper

<div align="center">
  <h3>🧠 A Powerful Mind Mapping Application / Una potente aplicación de mapas mentales</h3>
  <p>Built with Electron, React, and TypeScript / Creada con Electron, React y TypeScript</p>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L01NYP70)
</div>

## English

### v0.3 pre-release highlights

- **Multilanguage interface and documentation:** MindMapper is available in English and Spanish.
- **Node icons:** Choose an icon for each node to improve visual scanning and categorization.
- **Precise search highlighting:** Only the exact matching text is underlined; the rest of the node text remains unchanged.
- **Enhanced radial view:** Improvements to the radial visualization mode.
- **More color options:** Expanded node color customization.
- **Full node text visibility:** The complete node text is displayed inside each node.

For the complete version notes, see [RELEASE.md](./RELEASE.md).

### Features

MindMapper is a feature-rich mind mapping application designed to help you organize your thoughts, brainstorm ideas, and visualize complex concepts with ease.

- **Visual mind mapping:** drag and drop, hierarchical and radial views, customizable node colors, borders and icons, zoom and pan.
- **Editing and organization:** keyboard-based node creation, inline editing, undo/redo, collapse/expand, and smart search.
- **File management:** save and load `.mindmap.json` files; import JSON and Markdown outlines; export vector PDF and JSON.
- **Templates:** blank and brainstorming templates.
- **Theming:** light and dark themes with persisted preference.
- **Security:** secure IPC communication, context isolation, and a sandboxed renderer process.

### Installation

#### Download a binary (recommended)

Download the package for your platform from [Releases](https://github.com/Juan-31416/MindMapper/releases).

**Linux (AppImage):**
```bash
chmod +x MindMapper*.AppImage
./MindMapper*.AppImage
```

**Linux (Debian/Ubuntu):**
```bash
sudo dpkg -i mindmapper*.deb
```

**Windows:** Run `MindMapper Setup.exe` and follow the installer.

**macOS:** Open `MindMapper.dmg` and drag the application to Applications.

#### Build from source

**Prerequisites:** Node.js v16+ and npm.

```bash
git clone https://github.com/yourusername/mindmapper.git
cd mindmapper
npm install
npm run dev
```

For a production build and package:

```bash
npm run build
npm run package
```

### Quick start

1. Launch the application and start with a welcome mind map.
2. Press `Tab` to create a child node or `Enter` to create a sibling node.
3. Double-click a node to edit its text.
4. Use the right sidebar to change colors, icons, and styles.
5. Press `Ctrl+S` to save.
6. Export to PDF or JSON from the File menu.

### Documentation

- [Usage guide](./USAGE.md)
- [Architecture](./ARCHITECTURE.md)
- [Data schema](./DATA_SCHEMA.md)

### Architecture

- **Electron main process:** file operations, window management, and application menu.
- **Preload / IPC bridge:** secure, explicit communication between processes.
- **React renderer:** UI rendering, interactions, and state management.

### Technology stack

Electron · React · TypeScript · Zustand · Dagre · Vite · Lucide React

### Roadmap

#### v0.4

- Additional views: organigram, fishbone, and concept map
- More I/O formats: OPML, FreeMind `.mm`, PNG, and SVG export
- Minimap and focus mode

#### v1.0

- Plugin system
- Optional Java backend for Lucene and advanced PDF features
- Full ARIA accessibility
- AI assistant with local LLM and pluggable providers
- Anki card creation

## Español

### Novedades de la pre-release v0.3

- **Interfaz y documentación multilingües:** MindMapper está disponible en español e inglés.
- **Iconos de nodo:** selecciona un icono para cada nodo y mejora su identificación visual.
- **Resaltado preciso en la búsqueda:** solo se subraya el texto de coincidencia exacta; el resto del texto del nodo no se altera.
- **Vista radial mejorada:** mejoras en el modo de visualización radial.
- **Nuevas opciones de color:** se amplían las posibilidades de personalización cromática de los nodos.
- **Texto completo visible:** el contenido completo se muestra dentro de cada nodo.

Consulta las notas completas de versión en [RELEASE.md](./RELEASE.md).

### Funcionalidades

MindMapper es una aplicación de mapas mentales diseñada para organizar ideas, facilitar sesiones de lluvia de ideas y visualizar información compleja.

- **Mapas mentales visuales:** arrastrar y soltar, vistas jerárquica y radial, colores, bordes e iconos personalizables, zoom y desplazamiento.
- **Edición y organización:** creación de nodos con teclado, edición en línea, deshacer/rehacer, contraer/expandir y búsqueda inteligente.
- **Gestión de archivos:** guardado y carga en formato `.mindmap.json`; importación desde JSON y esquemas Markdown; exportación a PDF vectorial y JSON.
- **Plantillas:** plantillas en blanco y de lluvia de ideas.
- **Temas:** modos claro y oscuro con persistencia de la preferencia.
- **Seguridad:** IPC seguro, aislamiento de contexto y proceso renderer aislado.

### Instalación

#### Descargar un binario (recomendado)

Descarga el paquete para tu plataforma desde [Releases](https://github.com/Juan-31416/MindMapper/releases).

**Linux (AppImage):**
```bash
chmod +x MindMapper*.AppImage
./MindMapper*.AppImage
```

**Linux (Debian/Ubuntu):**
```bash
sudo dpkg -i mindmapper*.deb
```

**Windows:** ejecuta `MindMapper Setup.exe` y sigue el instalador.

**macOS:** abre `MindMapper.dmg` y arrastra la aplicación a Aplicaciones.

#### Compilar desde el código fuente

**Requisitos:** Node.js v16+ y npm.

```bash
git clone https://github.com/yourusername/mindmapper.git
cd mindmapper
npm install
npm run dev
```

Para compilar y empaquetar para producción:

```bash
npm run build
npm run package
```

### Inicio rápido

1. Inicia la aplicación y parte de un mapa mental de bienvenida.
2. Pulsa `Tab` para crear un nodo hijo o `Enter` para crear un nodo hermano.
3. Haz doble clic en un nodo para editar su texto.
4. Utiliza la barra lateral derecha para ajustar colores, iconos y estilos.
5. Pulsa `Ctrl+S` para guardar.
6. Exporta a PDF o JSON desde el menú Archivo.

### Documentación

- [Guía de uso](./USAGE.md)
- [Arquitectura](./ARCHITECTURE.md)
- [Esquema de datos](./DATA_SCHEMA.md)

### Arquitectura

- **Proceso principal de Electron:** operaciones de archivo, gestión de ventanas y menú de aplicación.
- **Preload / puente IPC:** comunicación explícita y segura entre procesos.
- **Renderer de React:** interfaz, interacciones y gestión de estado.

### Tecnologías

Electron · React · TypeScript · Zustand · Dagre · Vite · Lucide React

### Hoja de ruta

#### v0.4

- Vistas adicionales: organigrama, diagrama de espina de pescado y mapa conceptual
- Más formatos de entrada/salida: OPML, FreeMind `.mm`, exportación PNG y SVG
- Minimapa y modo de enfoque

#### v1.0

- Sistema de plugins
- Backend Java opcional para Lucene y PDF avanzado
- Accesibilidad ARIA completa
- Asistente de IA con LLM local y proveedores intercambiables
- Creación de tarjetas Anki

## Contributing / Contribuir

Contributions are welcome. Fork the repository, create a feature branch, commit your changes, push the branch, and open a pull request.

Se aceptan contribuciones. Haz un fork del repositorio, crea una rama de funcionalidad, confirma tus cambios, publica la rama y abre un pull request.

## Support / Soporte

- 🐛 [Report a bug / Informar de un error](https://github.com/Juan-31416/MindMapper/issues)
- 💡 [Request a feature / Solicitar una funcionalidad](https://github.com/Juan-31416/MindMapper/issues)
- 📧 [Contact / Contacto](mailto:jp.martintejeiro@qelronzal.com)

## License / Licencia

This project is licensed under the MIT License. See [LICENSE](LICENSE).

Este proyecto se distribuye bajo la licencia MIT. Consulta [LICENSE](LICENSE).

<div align="center">
  <p>Made with 🧠 by the MindMapper Team</p>
</div>
