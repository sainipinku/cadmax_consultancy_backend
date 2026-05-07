# Frontend Integration Guide - Dynamic Project Data

## Complete Data Flow: Admin → Backend → Frontend

### 1. Admin Management (Backend)
Admin can manage all project data through:
- **Admin Panel:** `http://localhost:3000/admin/projects`
- **API Base:** `http://localhost:5000/api/admin/projects`

### 2. Public API Endpoints (Frontend Consumption)
Frontend can consume project data through these public endpoints:

---

## Project Cards Display

### API Call
```javascript
// Get all project cards
const response = await fetch('http://localhost:5000/api/projects?type=cards');
const { data: projects } = await response.json();
```

### Response Format
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Highway Construction Project",
      "category": "PROJECT CARD",
      "sector": "ENGINEERING",
      "subCategory": "TRANSPORTATION",
      "location": "Delhi-Mumbai Expressway",
      "description": "Major highway construction project",
      "image": "https://s3.amazonaws.com/cadmax-uploads/image.jpg",
      "isActive": true,
      "isDeleted": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "type": "cards"
}
```

### Frontend Usage
```jsx
// React Component Example
import React, { useState, useEffect } from 'react';

const ProjectCards = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects?type=cards');
      const result = await response.json();
      setProjects(result.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="project-grid">
      {projects.map(project => (
        <div key={project._id} className="project-card">
          <img src={project.image} alt={project.title} />
          <h3>{project.title}</h3>
          <p>{project.location}</p>
          <span className="sector-badge">{project.sector}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## Project List Display

### API Call
```javascript
// Get all project list entries
const response = await fetch('http://localhost:5000/api/projects?type=list');
const { data: projects } = await response.json();
```

### Response Format
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Urban Planning Survey",
      "category": "PROJECT LIST",
      "sector": "SURVEYING",
      "subCategory": "TOPOGRAPHICAL",
      "location": "Bangalore Urban Area",
      "area": "2500 sq.km",
      "serialNumber": 1,
      "image": "https://s3.amazonaws.com/cadmax-uploads/project-image.jpg",
      "file": "https://s3.amazonaws.com/cadmax-uploads/project-document.pdf",
      "isActive": true,
      "isDeleted": false,
      "createdAt": "2024-01-10T09:15:00.000Z",
      "updatedAt": "2024-01-10T09:15:00.000Z"
    }
  ],
  "type": "list"
}
```

### Frontend Usage
```jsx
// Project List Table Component
const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjectList();
  }, []);

  const fetchProjectList = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects?type=list');
      const result = await response.json();
      setProjects(result.data);
    } catch (error) {
      console.error('Failed to fetch project list:', error);
    }
  };

  return (
    <table className="project-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Project Name</th>
          <th>Location</th>
          <th>Area</th>
          <th>File</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(project => (
          <tr key={project._id}>
            <td>{project.serialNumber}</td>
            <td>
              <div className="project-info">
                <img src={project.image} alt={project.title} className="project-thumb" />
                <span>{project.title}</span>
              </div>
            </td>
            <td>{project.location}</td>
            <td>{project.area}</td>
            <td>
              {project.file && (
                <a href={project.file} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              )}
            </td>
            <td>
              <span className={`status ${project.isActive ? 'active' : 'inactive'}`}>
                {project.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## Sector-Based Filtering

### Get Available Sectors
```javascript
const response = await fetch('http://localhost:5000/api/projects/sectors/list');
const { data: sectors } = await response.json();
// Result: ["ENGINEERING", "SURVEYING", "PLANNING"]
```

### Filter Projects by Sector
```javascript
// Get engineering project cards
const response = await fetch('http://localhost:5000/api/projects?type=cards&sector=ENGINEERING');
const { data: projects } = await response.json();
```

### Frontend Filter Component
```jsx
const ProjectFilter = ({ onFilterChange }) => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/sectors/list');
      const result = await response.json();
      setSectors(result.data);
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
    }
  };

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    onFilterChange(sector);
  };

  return (
    <div className="filter-controls">
      <select 
        value={selectedSector} 
        onChange={(e) => handleSectorChange(e.target.value)}
      >
        <option value="">All Sectors</option>
        {sectors.map(sector => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </select>
    </div>
  );
};
```

---

## Complete Project Page Integration

### Main Projects Page Component
```jsx
import React, { useState, useEffect } from 'react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' or 'list'
  const [selectedSector, setSelectedSector] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [activeTab, selectedSector]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/projects?type=${activeTab}`;
      if (selectedSector) {
        url += `&sector=${selectedSector}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      setProjects(result.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page">
      <h1>Our Projects</h1>
      
      <ProjectFilter onFilterChange={setSelectedSector} />
      
      <div className="tab-navigation">
        <button 
          className={activeTab === 'cards' ? 'active' : ''}
          onClick={() => setActiveTab('cards')}
        >
          Project Cards
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          Project List
        </button>
      </div>

      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <>
          {activeTab === 'cards' ? (
            <ProjectCards projects={projects} />
          ) : (
            <ProjectList projects={projects} />
          )}
        </>
      )}
    </div>
  );
};
```

---

## Environment Setup

### Frontend .env Configuration
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### API Service Helper
```javascript
// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Projects
  getProjects: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/projects?${queryString}`).then(res => res.json());
  },
  
  getSectors: () => {
    return fetch(`${API_BASE_URL}/projects/sectors/list`).then(res => res.json());
  },
  
  getProjectsBySector: (sector) => {
    return fetch(`${API_BASE_URL}/projects/sector/${sector}`).then(res => res.json());
  }
};
```

---

## Data Flow Summary

1. **Admin adds/edits projects** → Admin API (`/api/admin/projects`)
2. **Data stored in MongoDB** → With proper validation and file storage
3. **Frontend requests data** → Public API (`/api/projects`)
4. **Dynamic content displayed** → React components consume API data
5. **Real-time updates** → Any changes by admin immediately reflect on frontend

---

## Testing the Integration

### 1. Test Admin API
```bash
# Login as admin
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Create a test project (use token from login)
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Project" \
  -F "category=PROJECT CARD" \
  -F "sector=ENGINEERING" \
  -F "location=Test Location" \
  -F "image=@test-image.jpg"
```

### 2. Test Frontend API
```bash
# Get project cards
curl http://localhost:5000/api/projects?type=cards

# Get sectors
curl http://localhost:5000/api/projects/sectors/list

# Get filtered projects
curl "http://localhost:5000/api/projects?type=cards&sector=ENGINEERING"
```

### 3. Verify Frontend Integration
- Check browser network tab for API calls
- Verify data is displayed correctly
- Test filtering functionality
- Ensure images and files load properly

---

## Benefits of This Integration

✅ **Fully Dynamic:** Admin can manage all project content without code changes  
✅ **Real-time Updates:** Changes reflect immediately on frontend  
✅ **Scalable:** Easy to add new project types and filters  
✅ **User-friendly:** Intuitive admin interface for content management  
✅ **Performance:** Efficient API calls with proper filtering  
✅ **SEO Friendly:** Public endpoints can be cached and indexed
