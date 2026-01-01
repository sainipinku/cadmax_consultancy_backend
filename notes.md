backend/
├─ node_modules/
├─ uploads/
│  ├─ projects/
│  └─ services/

├─ src/
│
│  ├─ config/
│  │  ├─ db.js
│  │  └─ env.js
│
│  ├─ models/
│  │  ├─ Admin.model.js
│  │  ├─ Project.model.js
│  │  └─ Service.model.js
│
│  ├─ controllers/
│  │  ├─ auth/
│  │  │  └─ adminAuth.controller.js
│  │  │
│  │  ├─ dashboard.controller.js
│  │  ├─ project.controller.js
│  │  ├─ service.controller.js
│  │  └─ settings.controller.js
│
│  ├─ middlewares/
│  │  ├─ auth.middleware.js
│  │  ├─ upload.middleware.js
│  │  └─ error.middleware.js
│
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ dashboard.routes.js
│  │  ├─ project.routes.js
│  │  ├─ service.routes.js
│  │  └─ settings.routes.js
│
│  ├─ utils/
│  │  ├─ generateToken.js
│  │  ├─ hashPassword.js
│  │  └─ seedAdmin.js
│
│  ├─ app.js
│  └─ server.js
│
├─ scripts/
│  └─ createAdmin.js
│
├─ .env
├─ package.json


frontend structure
src/
 └─ admin/
    ├─ api/
    ├─ components/
    ├─ layout/
    │   ├─ AdminLayout.jsx
    │   ├─ Navbar.jsx
    │   └─ Sidebar.jsx
    ├─ pages/
    │   ├─ auth/
    │   │   └─ Login.jsx
    │   ├─ dashboard/
    │   │   └─ Dashboard.jsx
    │   ├─ projects/
    │   │   ├─ ProjectList.jsx
    │   │   ├─ AddProject.jsx
    │   │   └─ EditProject.jsx
    │   ├─ services/
    │   │   ├─ ServiceList.jsx
    │   │   ├─ AddService.jsx
    │   │   └─ EditService.jsx
    │   └─ settings/
    └─ routes/
        └─ AdminRoutes.jsx
 


mongodb+srv://pradeepsaini2206_db_user:<db_password>@cluster0.abw97u4.mongodb.net/?appName=Cluster0


Username: cadmaxadmin
Password: strongpassword123
Role: Read and write to any database




Email: admin@cadmax.com
Password: admin123