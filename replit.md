# Enterprise ERP & E-Commerce System

## Overview

This is a full-stack e-commerce and enterprise resource planning (ERP) application built for managing product catalogs, customer orders, and business operations. The system supports three distinct user roles: customers who browse and order products, salespersons who process orders and create delivery notes, and administrators who manage the entire system with full CRUD capabilities.

The application follows a hierarchical product catalog structure with four levels: Collection → Category → Subcollection → Subcategory → Product. This allows for sophisticated product organization and filtering capabilities for the customer-facing storefront.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Components**: The application uses shadcn/ui component library built on Radix UI primitives, providing a comprehensive set of accessible, customizable components. TailwindCSS handles styling with a custom design system defined in the index.css file using CSS variables for theming.

**State Management**: The application uses a hybrid approach:
- **Server State**: React Query (@tanstack/react-query) manages all server-side data fetching, caching, and synchronization
- **Local State**: Zustand handles client-side state, specifically the shopping cart which persists to localStorage
- **Rationale**: This separation ensures clean boundaries between ephemeral local state (cart) and server-synchronized data (products, orders, customers)

**Routing**: Wouter provides lightweight client-side routing. The application implements role-based navigation where users are automatically redirected based on their role (customer → /shop, salesperson → /sales, admin → /admin).

**Form Handling**: React Hook Form with Zod validation schemas (via @hookform/resolvers) provides type-safe form validation that matches the backend schema definitions.

### Backend Architecture

**Runtime**: Node.js with Express.js framework handling HTTP requests.

**API Design**: RESTful API structure with dedicated routes for each entity (collections, categories, subcollections, subcategories, suppliers, customers, products, purchase orders, delivery notes). The routes.ts file defines all API endpoints following conventional REST patterns (GET, POST, PUT, DELETE).

**Request Handling**: 
- JSON body parsing with 50MB limit to support bulk operations and file uploads
- Custom logging middleware tracks request duration and responses
- Error handling through standard Express error middleware

**Data Layer Abstraction**: The storage.ts file defines an IStorage interface that abstracts database operations, making it easy to swap implementations or add caching layers without changing business logic.

### Database & ORM

**Database**: PostgreSQL via Neon serverless database (@neondatabase/serverless with WebSocket support).

**ORM**: Drizzle ORM provides type-safe database queries and migrations. The schema is defined in shared/schema.ts and shared between frontend and backend for complete type safety across the stack.

**Schema Design**: 
- **Hierarchical Catalog**: Four-level product categorization (collections → categories → subcollections → subcategories) with cascading deletes to maintain referential integrity
- **Entities**: Products, Suppliers, Customers, Purchase Orders, Delivery Notes, and Images
- **Primary Keys**: Mix of serial integers (collections, subcollections, suppliers, customers, products) and text slugs (categories, subcategories) for SEO-friendly URLs
- **Validation**: Zod schemas generated from Drizzle tables using drizzle-zod ensure runtime validation matches database constraints

**Migration Strategy**: Drizzle Kit handles schema migrations with configuration in drizzle.config.ts. The system uses push-based migrations for rapid development.

### Build & Deployment

**Development**:
- Client runs on Vite dev server (port 5000) with HMR
- Server runs via tsx (TypeScript execution) with NODE_ENV=development
- Vite middleware mode integrates the dev server into Express for seamless development

**Production Build**:
- Custom build script (script/build.ts) uses esbuild to bundle the server with dependency bundling for improved cold start performance
- Vite builds the client to dist/public as static assets
- Server serves built client files and handles API routes

**Replit Integration**: Custom Vite plugins for Replit-specific features:
- meta-images plugin updates OpenGraph tags with deployment URLs
- Cartographer and dev-banner plugins in development mode
- Runtime error overlay for better debugging

### File Upload & Data Import

**Excel Import**: The admin inventory page supports bulk product import via XLSX files using the xlsx library. This allows administrators to quickly populate the catalog from spreadsheets.

**Image Handling**: Multer middleware (referenced in dependencies) handles file uploads for product and category images.

### Role-Based Access

**Client-Side Roles**: The Zustand store maintains currentUserRole state (customer, salesperson, admin) which controls:
- Navigation menu items
- Page access
- Available operations

**Implementation Note**: The current implementation uses client-side role switching without authentication. This is suitable for demonstration but would require proper authentication/authorization middleware in production.

### Mobile-First Design

The application uses responsive design patterns throughout:
- Mobile breakpoint at 768px (defined in use-mobile.tsx hook)
- Tailwind's responsive prefixes (sm:, md:, lg:) for adaptive layouts
- Sheet components for mobile navigation
- Touch-friendly UI elements

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver with WebSocket support
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Generates Zod validation schemas from Drizzle tables
- **express**: Web server framework
- **react**: UI framework
- **vite**: Build tool and dev server

### UI Component Libraries
- **@radix-ui/***: Headless accessible component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **@tanstack/react-query**: Server state management and data synchronization
- **zustand**: Client-side state management
- **wouter**: Lightweight routing library
- **lucide-react**: Icon library

### Styling & Utilities
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **clsx** / **tailwind-merge**: Conditional class name utilities

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Validation resolver for Zod schemas
- **zod**: Schema validation library

### Data Handling
- **xlsx**: Excel file parsing for bulk imports
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation

### Charts & Visualization
- **recharts**: Chart library for dashboard analytics

### Build Tools
- **esbuild**: Fast JavaScript bundler for production server build
- **tsx**: TypeScript execution for development
- **typescript**: Type system

### Development Tools (Replit-specific)
- **@replit/vite-plugin-cartographer**: Code navigation in Replit
- **@replit/vite-plugin-dev-banner**: Development environment banner
- **@replit/vite-plugin-runtime-error-modal**: Error overlay