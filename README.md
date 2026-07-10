# Ecommerce - Full Stack Application

Una aplicación de gestión de ecommerce, construida con **Next.js**, **Drizzle ORM**, **PostgreSQL**.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│                   Port: 5000                                │
│  - React Components con TypeScript                          │
│  - CSS para estilos                                         │
│  - Drizle ORM                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 Base de Datos (PostgreSQL)                  │
│                   Port: 5432                                │
│  - Tablas: collections, categories, subcollections,         │
│    subcategories, suppliers, customers, products            │
│  - Relaciones: 1:N entre modelos                            │
│  - Índices para optimización de consultas                   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Carpetas

```
ecommerce-next-fast/
├── client/
│   ├── public/
│   └── src/
├── dist/
│   └── public/
│       └── assets/
├── script/
├── server/
├── shared/
├── components.json
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── tsconfig.json
├── vite-plugin-meta-images.ts
├── vite.config.ts
└── .env.local                 # Variables de entorno
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Git
- Node.js 20+ (para desarrollo local del frontend)

### Opción: Desarrollo Local

#### Backend + Frontend

```bash
cd ecommerce-next-fast

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Acceder a http://localhost:5000
```

#### Base de Datos

```bash
npm run db:push
npm run db:seed
```

## 📊 Modelos de Datos

### Collections
- `id`: ID único
- `name`: Nombre
- `slug`: Slug

### Categories
- `id`: ID único
- `name`: Nombre
- `slug`: Slug
- `collection_id`: ID de Colección

### Subcollections
- `id`: ID único
- `name`: Nombre
- `category_slug`: Slug Categoría

### Subcategories
- `id`: ID único
- `name`: Nombre
- `slug`: Slug
- `subcollection_id`: ID de Subcolección

### Suppliers
- `id`: ID único
- `name`: Nombre
- `contact`: Contacto

### Customers
- `id`: ID único
- `name`: Nombre
- `address`: Domicilio
- `phone`: Teléfono
- `taxpayer_id`: ID de Fisco

### Products
- `id`: ID único
- `supplier_id`: ID Proveedor
- `name`: Nombre
- `description`: Descripción
- `price`: Precio
- `subcategory_slug`: Slug Subcategoría
- `article`: Artículo
- `code`: Código

## 🔌 Endpoints de la API

### Autenticación


## 🛠️ Configuración

### Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://postgres:postgresql2026@localhost:5432/erp_dev

```


## 📝 Casos de Uso


## 🧪 Testing


### Iniciar sesión


## 📚 Documentación Interactiva


## 🐛 Solución de Problemas


### Errores de conexión a BD


## 🚀 Deployment


## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Contribuciones


## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.
