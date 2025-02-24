# Componente de Login

## Descripción

El componente de login proporciona una interfaz de usuario moderna y responsiva para la autenticación de usuarios en BoltFitness. Implementa un diseño minimalista con efectos visuales atractivos y feedback interactivo.

## Características

### Visuales

- Logo animado con efecto de brillo pulsante
- Gradiente de fondo suave
- Efecto de desenfoque (backdrop blur) en el contenedor
- Transiciones suaves en interacciones
- Diseño responsivo para todos los dispositivos

### Funcionales

- Validación de campos requeridos
- Estado de carga durante la autenticación
- Feedback visual mediante toasts
- Redirección automática post-login
- Almacenamiento de token en cookies

## Implementación

### Uso

```tsx
import LoginPage from '@/app/login/page';

// El componente se usa como página en Next.js
// No requiere props ya que gestiona su propio estado
```

### Props

El componente no acepta props ya que está diseñado como una página autónoma.

### Estado

```typescript
const [isLoading, setIsLoading] = useState(false);
```

### Estilos

Los estilos utilizan Tailwind CSS con las siguientes características:

- Contenedor principal: `bg-gradient-to-br from-background via-background to-secondary/30`
- Contenedor del formulario: `bg-black/40 backdrop-blur-sm`
- Inputs: `bg-black/50 focus:bg-black/70`
- Botón: `bg-primary hover:bg-primary/90 hover:scale-[1.02]`

### Efectos y Animaciones

```css
.logo-glow {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  }
}
```

## Integración con el Sistema

### Rutas

- Ruta: `/login`
- Redirección post-login: `/dashboard`

### Middleware

```typescript
// src/middleware.ts
if (pathname.startsWith('/dashboard')) {
  const token = request.cookies.get('auth-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Notificaciones

Utiliza el sistema de toasts para feedback:

```typescript
toast.success('Inicio de sesión exitoso');
toast.error('Error al iniciar sesión');
```

## Personalización

El componente puede ser personalizado a través de:

- Variables CSS en `globals.css`
- Clases de Tailwind en el componente
- Configuración de colores en `tailwind.config.js`

## Mejoras Futuras

- [ ] Implementar recuperación de contraseña
- [ ] Añadir autenticación social
- [ ] Implementar 2FA
- [ ] Añadir animaciones de transición entre estados
- [ ] Mejorar la accesibilidad

## Dependencias

- Next.js 14.1.0
- Tailwind CSS
- Sonner (toasts)
- @radix-ui/react-label
- next/image
