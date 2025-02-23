# Aplicación de Gimnasio

## Descripción

Esta es una aplicación integral y escalable para la gestión de un gimnasio, diseñada para mejorar la experiencia del usuario mediante una estructura de roles sólida y una base de datos robusta. La aplicación permite a los usuarios interactuar como estudiantes y profesores, ofreciendo funcionalidades avanzadas para la gestión de ejercicios, progreso y logros.

## Características

- **Sistema de Usuarios y Roles:**
  - Roles de Administrador, Moderador, Usuario (Básico, Medio, Maestro, Premium) y Profesor/Estudiante.
  - Gestión de permisos detallada para cada rol.

- **Base de Datos y Estructura de Contenido:**
  - Tablas para usuarios, roles, ejercicios, asignaciones, progreso, logros e interacciones.
  - Relación profesor-estudiante para seguimiento de progreso y asignación de ejercicios.

- **Interacción y Funcionalidades:**
  - Panel dedicado para profesores con herramientas de asignación y retroalimentación.
  - Dualidad de interfaz para usuarios con rol dual (profesor/estudiante).

- **Seguridad y Privacidad:**
  - Encriptación de contraseñas y datos sensibles.
  - Autenticación en dos pasos (2FA) y gestión robusta de sesiones.

## Instalación

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/aplicacion-gimnasio.git
   cd aplicacion-gimnasio
   ```

2. **Configurar el Entorno:**
   - Asegúrate de tener instalado [Node.js](https://nodejs.org/) y [PostgreSQL](https://www.postgresql.org/).
   - Crea un archivo `.env` basado en el archivo `.env.example` y configura tus variables de entorno.

3. **Instalar Dependencias:**
   ```bash
   npm install
   ```

4. **Configurar la Base de Datos:**
   - Ejecuta las migraciones para crear las tablas necesarias:
     ```bash
     npm run migrate
     ```

5. **Iniciar el Servidor:**
   ```bash
   npm start
   ```

## Uso

- Accede a la aplicación en `http://localhost:3000`.
- Regístrate como usuario y explora las funcionalidades disponibles según tu rol.
- Los profesores pueden asignar ejercicios y revisar el progreso de sus estudiantes desde su panel dedicado.

## Contribución

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, por favor contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com).

## Despliegue

El proyecto está configurado para ser desplegado en Vercel. Para desplegar:

1. Instalar Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Configurar variables de entorno:
   ```bash
   npm run setup:vercel
   ```

3. Desplegar:
   ```bash
   npm run vercel:deploy
   ```
