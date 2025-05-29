# ClickChain

A powerful Node.js backend application for managing click chains, user authentication, and data persistence with MongoDB integration.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Click Chain Management**: Create, read, update, and delete click chains
- **MongoDB Integration**: Robust data persistence with MongoDB
- **RESTful API**: Well-structured REST endpoints
- **Environment Configuration**: Flexible configuration management
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClickChainBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/clickchain
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
ClickChainBackend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── clickChainController.js # Click chain operations
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User model schema
│   └── ClickChain.js       # Click chain model schema
├── routes/
│   ├── auth.js             # Authentication routes
│   └── clickChains.js      # Click chain routes
├── utils/
│   └── helpers.js          # Utility functions
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
├── server.js              # Main server file
└── README.md              # Project documentation
```

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Click Chain Routes

#### Get All Click Chains
```http
GET /api/clickchains
Authorization: Bearer <jwt_token>
```

#### Get Click Chain by ID
```http
GET /api/clickchains/:id
Authorization: Bearer <jwt_token>
```

#### Create New Click Chain
```http
POST /api/clickchains
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My Click Chain",
  "description": "Description of the click chain",
  "steps": [
    {
      "action": "click",
      "element": "#button1",
      "delay": 1000
    },
    {
      "action": "type",
      "element": "#input1",
      "value": "Hello World",
      "delay": 500
    }
  ]
}
```

#### Update Click Chain
```http
PUT /api/clickchains/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Click Chain",
  "description": "Updated description"
}
```

#### Delete Click Chain
```http
DELETE /api/clickchains/:id
Authorization: Bearer <jwt_token>
```

## 🔧 Extension Usage

The ClickChain application is designed to work with browser extensions for automated clicking and interaction workflows.

### Extension Integration

1. **API Communication**: Extensions communicate with the backend through the REST API endpoints
2. **Authentication**: Extensions must authenticate users and store JWT tokens for API requests
3. **Click Chain Execution**: Extensions can fetch click chains and execute them in the browser

### Extension Development Guide

#### 1. Authentication Flow
```javascript
// In your browser extension
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    // Store token in extension storage
    chrome.storage.local.set({ authToken: data.token });
  }
  return data;
};
```

#### 2. Fetching Click Chains
```javascript
const getClickChains = async () => {
  const { authToken } = await chrome.storage.local.get('authToken');
  
  const response = await fetch('http://localhost:3000/api/clickchains', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  return await response.json();
};
```

#### 3. Executing Click Chains
```javascript
const executeClickChain = async (clickChain) => {
  for (const step of clickChain.steps) {
    switch (step.action) {
      case 'click':
        const element = document.querySelector(step.element);
        if (element) element.click();
        break;
      case 'type':
        const input = document.querySelector(step.element);
        if (input) input.value = step.value;
        break;
    }
    
    // Wait for specified delay
    if (step.delay) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }
  }
};
```

### Extension Manifest Example (Manifest V3)
```json
{
  "manifest_version": 3,
  "name": "ClickChain Extension",
  "version": "1.0",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "http://localhost:3000/*"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "clickchain-backend"
pm2 startup
pm2 save
```

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@clickchain.com or create an issue in the repository.

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication system
- Click chain CRUD operations
- MongoDB integration
- REST API implementation

---

**Made with ❤️ by the ClickChain Team**
