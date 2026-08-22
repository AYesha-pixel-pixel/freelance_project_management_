# freelance_project_management_

Freelance project management tooling and workflows.
This project aims to help freelancers in managing their projects efficiently . This would include keeping a track of all the projects taken in by the user. They can keep track of the projects , their timelines , deadlines , essential notes , number of revisions , price of the project etc . 

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Architecture:** MERN Stack

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/freelance_project_management_.git
cd freelance_project_management_
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance_pm
JWT_SECRET=your_jwt_secret_key
```

### 3. Backend Setup

```bash
cd server
npm install
npm run dev
```

### 4. Frontend Setup

```bash
cd client
npm install
npm start
```

The application will be accessible at `http://localhost:3000`.
