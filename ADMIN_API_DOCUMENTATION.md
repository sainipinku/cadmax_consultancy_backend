# Admin API Documentation

## Complete Admin Backend for Dynamic Frontend Data Management

### Base URL: `http://localhost:5000/api/admin`

## Authentication
All admin endpoints (except login) require JWT authentication. Include the token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Authentication Endpoints

### POST `/auth/login`
Login admin user
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@example.com"
  }
}
```

### GET `/auth/profile`
Get admin profile (requires authentication)

---

## 2. Categories Management

### POST `/categories`
Create new category (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** `name` (required), `image` (file, required)

### GET `/categories`
Get all categories (requires authentication)

### GET `/categories/:id`
Get category by ID (requires authentication)

### PUT `/categories/:id`
Update category (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** `name` (optional), `image` (file, optional)

### DELETE `/categories/:id`
Delete category (requires authentication)

---

## 3. SubCategories Management

### POST `/subcategories`
Create new subcategory (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** 
  - `service` (required): "engineering" | "surveying" | "planning"
  - `sectionType` (required): "hero" | "overlap" | "content" | "collage"
  - `title` (optional)
  - `description` (optional)
  - `redirectLink` (optional)
  - `status` (optional, default: true)
  - `image` (file, optional)

### GET `/subcategories`
Get all subcategories (requires authentication)

### GET `/subcategories/:id`
Get subcategory by ID (requires authentication)

### PUT `/subcategories/:id`
Update subcategory (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** Same as create, all optional

### DELETE `/subcategories/:id`
Delete subcategory (requires authentication)

---

## 4. Slider Images Management

### POST `/slider`
Create new slider image (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** 
  - `title` (required)
  - `serviceSlug` (required): "engineering" | "surveying" | "planning"
  - `image` (file, required)

### GET `/slider`
Get all slider images (requires authentication)
- **Query Params:** `serviceSlug` (optional) - filter by service

### GET `/slider/:id`
Get slider image by ID (requires authentication)

### PUT `/slider/:id`
Update slider image (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** `title` (optional), `serviceSlug` (optional), `image` (file, optional)

### DELETE `/slider/:id`
Delete slider image (requires authentication)

---

## 5. Inquiries Management

### GET `/inquiries`
Get all inquiries (requires authentication)
- **Query Params:**
  - `status` (optional): "unread" | "read" | "replied"
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### GET `/inquiries/:id`
Get inquiry by ID (requires authentication)

### PUT `/inquiries/:id/status`
Update inquiry status (requires authentication)
```json
{
  "status": "read" // "unread" | "read" | "replied"
}
```

### DELETE `/inquiries/:id`
Delete inquiry (requires authentication)

---

## 6. Projects Management

### Admin Project Management Endpoints
Base URL: `http://localhost:5000/api/admin/projects`

### GET `/projects`
Get all projects for admin (includes deleted projects)
- **Query Params:** `includeDeleted=true` (optional) - include soft-deleted projects

### POST `/projects`
Create new project (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `title` (required)
  - `category` (required): "PROJECT CARD" | "PROJECT LIST"
  - `sector` (required): "ENGINEERING" | "SURVEYING" | "PLANNING"
  - `location` (required)
  - `subCategory` (optional)
  - `description` (optional)
  - `content` (optional)
  - `area` (optional) - for PROJECT LIST entries
  - `serialNumber` (optional) - auto-generated if area provided
  - `isActive` (optional, default: true)
  - `image` (file, required)
  - `file` (file, optional) - PDF/DOC for PROJECT LIST entries

### PUT `/projects/:id`
Update project (requires authentication)
- **Content-Type:** `multipart/form-data`
- **Fields:** Same as create, all optional

### DELETE `/projects/:id`
Soft delete project (requires authentication)

### PUT `/projects/:id/restore`
Restore soft-deleted project (requires authentication)

### DELETE `/projects/:id/permanent`
Permanently delete project (requires authentication)

---

## 7. Public Project Endpoints (Frontend Consumption)

Base URL: `http://localhost:5000/api/projects`

### GET `/`
Get public projects with filtering
- **Query Params:**
  - `type` (optional): "cards" | "list" - filter by project type
  - `sector` (optional): "ENGINEERING" | "SURVEYING" | "PLANNING"
  - `subCategory` (optional): filter by subcategory
  - `category` (optional): "PROJECT CARD" | "PROJECT LIST"

**Examples:**
```bash
# Get all project cards
GET /api/projects?type=cards

# Get all project list entries
GET /api/projects?type=list

# Get engineering projects
GET /api/projects?sector=ENGINEERING

# Get project cards for engineering sector
GET /api/projects?type=cards&sector=ENGINEERING
```

### GET `/sector/:sector`
Get projects by specific sector
- **Params:** `sector` - "ENGINEERING" | "SURVEYING" | "PLANNING"

### GET `/sectors/list`
Get all available sectors with active projects

**Response:**
```json
{
  "success": true,
  "data": ["ENGINEERING", "SURVEYING", "PLANNING"]
}
```

---

## Error Response Format
All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "success": false
}
```

## Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

## File Upload Support
- **Image Types:** JPEG, PNG, WebP
- **Max Size:** 10MB
- **Storage:** AWS S3 (configured in environment)

## Testing Commands

### 1. Login to get token:
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### 2. Use token for authenticated requests:
```bash
curl -X GET http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Create category with image:
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Test Category" \
  -F "image=@/path/to/image.jpg"
```

---

## Frontend Integration

The admin can now manage all dynamic data for frontend pages:

1. **Categories** - Main service categories
2. **SubCategories** - Service page sections (hero, overlap, content, collage)
3. **Slider Images** - Service page sliders
4. **Inquiries** - Contact form submissions
5. **Projects** - Project showcase (already implemented)

All data is dynamically available for frontend consumption through public API endpoints.
