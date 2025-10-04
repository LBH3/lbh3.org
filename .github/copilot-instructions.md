# LBH3.org GitHub Copilot Instructions

## Overview

This file enables AI coding assistants to generate features aligned with the LBH3.org project's architecture and style. It is based entirely on actual, observed patterns from the codebase — not invented practices. The LBH3.org project is a Hash House Harriers club management system built with CanJS/FeathersJS stack.

## Technology Stack

- **Backend**: FeathersJS v3 with Node.js, PostgreSQL/PostGIS, Sequelize v4 ORM
- **Frontend**: CanJS v4/5 with Stache templates, LESS CSS, Webpack 5 build system
- **Authentication**: JWT tokens with OAuth2 (Google, Facebook) and role-based authorization
- **Real-time**: Socket.IO for live updates
- **Testing**: QUnit/FuncUnit (frontend), Mocha (backend)
- **Deployment**: Heroku with AWS S3 for file storage

## File Category Reference

### Frontend CanJS Components
**Location**: `public/components/`
**Examples**: `public/components/home/home.js`, `public/components/hasher/hasher.js`
**Key Conventions**: 
- Use `Component.extend()` with `tag: 'lbh3-component-name'` pattern
- ViewModel defined as object literal with computed properties using `get` methods
- Session access via `get session() { return Session.current; }`
- Template imported as `view` and referenced directly

### Frontend Stache Templates
**Location**: `public/components/*/component.stache`
**Examples**: `public/components/home/home.stache`, `public/components/hasher/hasher.stache`
**Key Conventions**:
- Start with `<can-import>` statements for dependencies
- Use `:from` for one-way data binding, `:to` for event binding
- Authentication checks follow nested `{{#if session.user}}` pattern
- Route URLs generated with `{{routeUrl page='pageName' id=itemId}}` helper

### Frontend Data Models
**Location**: `public/models/`
**Examples**: `public/models/hasher.js`, `public/models/event.js`
**Key Conventions**:
- Extend `DefineMap` with `seal: false` as first property
- Include `identity: true, type: 'number'` for `id` property
- Connection via `feathersModel('/api/endpoint', {Map, List, name})`
- Promise-based relationships using `dataPromise` and `data` property pairs

### Frontend LESS Styles
**Location**: `public/components/*/component.less`, `public/styles.less`
**Key Conventions**:
- Component-specific styles scoped to component tag name
- Use Bootstrap 4 classes for layout and common styling
- Import global variables and mixins as needed

### Backend Services
**Location**: `src/services/*/service-name.service.js`
**Examples**: `src/services/hashers/hashers.service.js`, `src/services/events/events.service.js`
**Key Conventions**:
- Export function with `const app = this;` pattern
- Use `feathers-sequelize` with `createService(options)`
- Register at `/api/service-name` endpoints
- Apply hooks via `service.hooks(hooks)`

### Backend Service Hooks
**Location**: `src/services/*/service-name.hooks.js`
**Key Conventions**:
- Export object with `before`, `after`, `error` sections
- Include all CRUD methods (`all`, `find`, `get`, `create`, `update`, `patch`, `remove`)
- Authentication via `authenticate('jwt')` in `before.all`
- Authorization using `authHook.restrictTo()` patterns

### Backend Database Models
**Location**: `src/models/model-name.model.js`
**Key Conventions**:
- Export function accepting `app` parameter
- Use `sequelizeClient.define()` with snake_case table names
- Include `beforeCount` hook with `options.raw = true`
- Define associations in `associate` function

## Feature Scaffold Guide

### Creating a New Component
When implementing a new UI component:

1. **Create component folder**: `public/components/feature-name/`
2. **Required files**:
   - `feature-name.js` - Component logic with ViewModel
   - `feature-name.stache` - Template with imports and data binding
   - `feature-name.less` - Component-specific styles
   - `feature-name-test.js` - QUnit tests
   - `feature-name.html` - Demo page

3. **Component structure**:
```javascript
import Component from 'can-component';
import view from './feature-name.stache';

export default Component.extend({
  tag: 'lbh3-feature-name',
  view,
  ViewModel: {
    get session() {
      return Session.current;
    }
    // Other properties and methods
  }
});
```

### Creating a New Service
When implementing a new backend service:

1. **Create service folder**: `src/services/service-name/`
2. **Required files**:
   - `service-name.service.js` - Service definition
   - `service-name.hooks.js` - Service hooks
   - Corresponding model: `src/models/service-name.model.js`

3. **Register in**: `src/services/index.js`
4. **Service structure follows feathers-sequelize pattern**

### Creating a New Model
When implementing a new data model:

1. **Frontend model**: `public/models/model-name.js`
2. **Backend model**: `src/models/model-name.model.js`
3. **Migration**: `migrations/TIMESTAMP-model-name.js`

## Integration Rules

### Authentication and Authorization
- All components accessing session use `Session.current` singleton
- Backend services use `authenticate('jwt')` for protected endpoints
- Role-based access uses Hash House Harriers positions (WEBMASTERS, GRANDMASTERS, etc.)
- User context available in hooks via `hook.params.user`

### Data Layer Integration
- All API communication through Feathers client with automatic Socket.IO fallback
- Models use `feathersModel()` connection for CRUD operations
- Real-time updates automatically propagate to connected components
- Promise-based data loading with `dataPromise` and `data` property patterns

### Routing
- All routes registered in `public/app.js` using `route.register()` pattern
- URLs follow `/{page}/{id?}/{secondaryPage?}/` structure
- Route data accessed via computed properties from `routeData`
- Navigation URLs generated with `routeUrl` helper

### Hash House Harriers Domain Rules
- Use HHH-specific terminology: `hasher` (not user), `trailNumber` (not eventId), `hashName` (not nickname)
- Display names use `hashOrJustName` pattern
- Leadership roles called "mismanagement" with specific position IDs
- Events include HHH-specific roles: hares, scribes, hashit comments

## Example Prompt Usage

**User Request**: "Create a searchable dropdown that lets users filter hashers by kennel"

**Expected AI Response**:
- `public/components/hasher-kennel-filter/hasher-kennel-filter.js` - CanJS component with search functionality
- `public/components/hasher-kennel-filter/hasher-kennel-filter.stache` - Template with dropdown and search input
- `public/components/hasher-kennel-filter/hasher-kennel-filter.less` - Component styles
- `public/components/hasher-kennel-filter/hasher-kennel-filter-test.js` - QUnit tests
- Integration with existing Hasher model using `Hasher.getList()` with kennel filtering

**User Request**: "Add API endpoint for tracking hasher attendance streaks"

**Expected AI Response**:
- `src/services/attendance-streaks/attendance-streaks.service.js` - Custom FeathersJS service
- `src/services/attendance-streaks/attendance-streaks.hooks.js` - Authentication and authorization hooks
- Service registered in `src/services/index.js`
- Uses existing events-hashers relationships for streak calculation

This instruction file ensures AI assistants understand the project's unique CanJS/FeathersJS architecture, Hash House Harriers domain conventions, and established code patterns for consistent feature development.