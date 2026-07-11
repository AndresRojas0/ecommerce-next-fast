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
Directory structure:
andresrojas0-ecommerce-next-fast/
├── README.md
├── components.json
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── replit.md
├── tsconfig.json
├── vite-plugin-meta-images.ts
├── vite.config.ts
├── .replit
├── attached_assets/
│   ├── Pasted-PayloadTooLargeError-request-entity-too-large-at-readSt_1765206137087.txt
│   └── Pasted-Role-1764509300771_1764509300773.txt
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── components/
│       │   ├── layout.tsx
│       │   ├── crud/
│       │   │   ├── category-tree.tsx
│       │   │   ├── customer-manager.tsx
│       │   │   └── supplier-manager.tsx
│       │   └── ui/
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button-group.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── empty.tsx
│       │       ├── field.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-group.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── item.tsx
│       │       ├── kbd.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── sonner.tsx
│       │       ├── spinner.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toast.tsx
│       │       ├── toaster.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       ├── hooks/
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── api.ts
│       │   ├── hooks.ts
│       │   ├── queryClient.ts
│       │   ├── store.ts
│       │   └── utils.ts
│       └── pages/
│           ├── admin-dashboard.tsx
│           ├── admin-entities.tsx
│           ├── admin-inventory.tsx
│           ├── customer-cart.tsx
│           ├── customer-shop.tsx
│           ├── home.tsx
│           ├── not-found.tsx
│           └── sales-dashboard.tsx
├── script/
│   └── build.ts
├── server/
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── seed.ts
│   ├── static.ts
│   ├── storage.ts
│   └── vite.ts
└── shared/
    └── schema.ts
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
