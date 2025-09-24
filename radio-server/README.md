# Radio Comunitaria Pinto Los Pellines

Un servidor de radio streaming comunitario construido con Node.js, Express y Socket.IO para permitir que la comunidad de Pinto Los Pellines transmita su propia radio en vivo y gestione playlists de audio.

## 🚀 Características

- **Transmisión en Vivo**: Inicia transmisiones en vivo con metadatos personalizados
- **Gestión de Playlist**: Sube canciones y organízalas en playlists
- **Streaming HTTP**: Compatible con reproductores de radio web estándar
- **Interfaz Web**: Panel de control intuitivo para gestionar la radio
- **Tiempo Real**: Actualizaciones en vivo mediante WebSockets
- **Soporte CORS**: Compatible con aplicaciones web modernas
- **Reproducción Automática**: Cambia automáticamente entre canciones

## 📋 Requisitos

- Node.js 16+
- npm o yarn
- Puerto 3001 disponible (configurable)

## 🛠️ Instalación

1. **Instalar dependencias:**

   ```bash
   cd radio-server
   npm install
   ```

2. **Crear directorios necesarios:**

   ```bash
   mkdir -p uploads public
   ```

3. **Iniciar el servidor:**

   ```bash
   npm start
   ```

4. **Para desarrollo (con recarga automática):**

   ```bash
   npm run dev
   ```

## 🌐 Uso

### Acceder a la Interfaz Web

Abre tu navegador y ve a: `http://localhost:3001`

### URLs de Streaming

- **Stream Principal**: `http://localhost:3001/stream`
- **Estado Actual**: `http://localhost:3001/status`
- **Playlist**: `http://localhost:3001/playlist`
- **Health Check**: `http://localhost:3001/health`

### API Endpoints

#### GET `/status`

Obtiene el estado actual de la radio.

```json
{
  "isLive": false,
  "currentTrack": {...},
  "listeners": 5,
  "metadata": {...}
}
```

#### POST `/upload`

Sube un archivo de audio.

- **Content-Type**: `multipart/form-data`
- **Campos**: `audio` (file), `title` (string), `artist` (string)

#### POST `/live/start`

Inicia una transmisión en vivo.

```json
{
  "title": "Programa Comunitario",
  "artist": "Comunidad Local",
  "description": "Transmisión en vivo desde la plaza"
}
```

#### POST `/live/stop`

Detiene la transmisión en vivo.

#### POST `/track/:id`

Cambia a una canción específica de la playlist.

#### DELETE `/track/:id`

Elimina una canción de la playlist.

## 🎵 Formatos de Audio Soportados

- MP3
- AAC
- WAV
- OGG

## 🔧 Configuración

### Variables de Entorno

```bash
PORT=3001                    # Puerto del servidor
NODE_ENV=production         # Entorno de ejecución
```

### Configuración del Servidor

Edita `server.js` para modificar:

- Puerto de escucha
- Límites de subida de archivos
- Configuración CORS
- Intervalos de auto-reproducción

## 📡 Integración con la App Principal

Para integrar este servidor con tu aplicación principal de Pellines:

1. **Actualizar las semillas de radio** en `convex/seeds/radio.ts`:

   ```typescript
   {
     name: 'Radio Comunitaria Pinto Los Pellines',
     streamUrl: 'http://tu-servidor:3001/stream',
     backupStreamUrl: 'http://tu-servidor:3001/stream',
     // ... otros campos
   }
   ```

2. **Configurar CORS** para permitir conexiones desde tu dominio.

3. **Monitorear el estado** mediante el endpoint `/status`.

## 🎙️ Guía de Transmisión

### Transmisión Básica

1. Abre la interfaz web en `http://localhost:3001`
2. Sube canciones usando el formulario de subida
3. Haz clic en "Iniciar Transmisión en Vivo" para comenzar
4. Actualiza los metadatos según sea necesario
5. La radio cambiará automáticamente entre canciones

### Transmisión en Vivo

- Usa software como OBS Studio, Streamlabs, o similar
- Configura el destino como `rtmp://tu-servidor/live`
- El servidor detectará automáticamente la transmisión en vivo

## 🔍 Monitoreo

### Logs del Servidor

El servidor registra todas las conexiones, subidas y cambios de estado en la consola.

### Health Check

Endpoint `/health` proporciona métricas del servidor:

```json
{
  "status": "healthy",
  "uptime": 3600,
  "listeners": 5,
  "isLive": false,
  "currentTrack": {...},
  "playlistLength": 10
}
```

## 🛡️ Seguridad

- Implementa autenticación para endpoints de administración
- Configura HTTPS en producción
- Limita el tamaño de archivos subidos
- Valida tipos de archivos
- Monitorea uso de ancho de banda

## 🚀 Despliegue en Producción

1. **Configurar un servidor web** (nginx, Apache)
2. **SSL/TLS** para conexiones seguras
3. **Firewall** para proteger puertos
4. **Monitoreo** de recursos del sistema
5. **Backups** regulares de la carpeta `uploads`

### Ejemplo de configuración Nginx

```nginx
server {
    listen 80;
    server_name radio.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /stream {
        proxy_pass http://localhost:3001;
        proxy_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 Solución de Problemas

### Problemas Comunes

**La transmisión no se reproduce:**

- Verifica que el puerto 3001 esté abierto
- Comprueba que no haya firewall bloqueando conexiones
- Revisa los logs del servidor

**Los archivos no se suben:**

- Verifica permisos de escritura en la carpeta `uploads`
- Comprueba límites de tamaño de archivo
- Valida que el formato de audio sea soportado

**Conexiones WebSocket fallan:**

- Verifica configuración CORS
- Comprueba que Socket.IO esté sirviendo correctamente

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo de la aplicación Pellines.

---

¡Feliz transmisión! 📻🎵
