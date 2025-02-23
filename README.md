# BoltFitness App 🏋️‍♂️

Aplicación de entrenamiento personal con funcionalidades avanzadas de seguimiento, autenticación segura y experiencia offline.

## Características Principales 🚀

### Autenticación y Seguridad 🔐

- Autenticación de dos factores (2FA) con QR y códigos de respaldo
- Autenticación biométrica mediante WebAuthn
- Gestión segura de sesiones con Supabase
- Sistema de recuperación de cuenta

### Experiencia Offline 📱

- Funcionamiento completo sin conexión
- Sincronización automática al recuperar conexión
- Cache inteligente de recursos
- Almacenamiento local de entrenamientos

### Notificaciones Push 🔔

- Recordatorios personalizados de entrenamiento
- Alertas de logros y objetivos
- Recordatorios de hidratación
- Notificaciones de racha de ejercicios

### Monitoreo y Rendimiento 📊

- Logging estructurado con Pino
- Integración con Sentry para errores
- Métricas de performance
- Sistema de alertas personalizado

## Tecnologías Utilizadas 💻

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Supabase, Redis
- **Testing**: Jest, Testing Library
- **PWA**: Service Workers, WebAuthn
- **Monitoreo**: Sentry, Pino
- **CI/CD**: GitHub Actions, Vercel

## Estructura del Proyecto 📁

```
src/
├── components/         # Componentes React
├── lib/               # Utilidades y servicios
│   ├── auth/          # Servicios de autenticación
│   ├── monitoring/    # Logging y monitoreo
│   └── notifications/ # Sistema de notificaciones
├── pages/             # Rutas de Next.js
├── styles/           # Estilos globales
└── tests/            # Tests unitarios y de integración
```

## Configuración Local 🛠️

1. **Requisitos Previos**

   ```bash
   Node.js >= 16.x
   npm >= 8.x
   ```

2. **Instalación**

   ```bash
   git clone https://github.com/tu-usuario/boltfitness-app.git
   cd boltfitness-app
   npm install
   ```

3. **Variables de Entorno**

   ```bash
   cp .env.example .env.local
   # Configurar las variables necesarias
   ```

4. **Desarrollo Local**
   ```bash
   npm run dev
   ```

## Scripts Disponibles 📝

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run test`: Ejecuta los tests
- `npm run lint`: Verifica el código con ESLint
- `npm run type-check`: Verifica los tipos de TypeScript

## Documentación 📚

Documentación detallada disponible en `/docs`:

- [Guía de Componentes](/docs/components)
- [Hooks Personalizados](/docs/hooks)
- [Contextos](/docs/contexts)
- [Servicios](/docs/services)
- [Base de Datos](/docs/database)
- [Testing](/docs/testing)

## Contribución 🤝

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia 📄

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto 📧

- Proyecto: [https://github.com/tu-usuario/boltfitness-app](https://github.com/tu-usuario/boltfitness-app)
- Sitio Web: [https://boltfitness.app](https://boltfitness.app)

---

Desarrollado con ❤️ por el equipo de BoltFitness
