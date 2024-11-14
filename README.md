# SnapShare Backend - Node.js API

## Project Overview
SnapShare Backend is the server-side application supporting the SnapShare social network. It provides RESTful API endpoints for user authentication, media post management, and user interactions like comments and likes. Built with Node.js and TypeScript, it integrates MongoDB for data storage, Cloudinary for media management, and JWT for secure user authentication.

This project is developed as part of the **University Project** for the **Universidad Argentina de la Empresa (UADE)**, under the guidance of Christian Mazzeo. We are **Group 16**.

## Key Features
- **User Authentication**: Secure login and registration with JWT.
- **Media Upload**: Image and video upload support using Cloudinary.
- **Post Management**: Create, update, and delete posts.
- **User Interaction**: Like and comment on posts.
- **Password Reset**: Supports password reset via email and a landing page hosted on Vercel.
- **Scalable Architecture**: Designed for flexibility and performance.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **TypeScript**: For type safety and better development experience.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for efficient data storage.
- **Cloudinary**: For media storage and management.
- **JWT**: For user authentication and session management.
- **Vercel**: For deployment of the backend and landing page.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/matiasbiagetti/backend-red-social.git
   cd backend-red-social
   ```

2. **Install Dependencies:**
   Ensure you have `npm` or `yarn` installed.
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=
   MONGO_URI=
   JWT_SECRET=
   EMAIL_USERNAME=
   EMAIL_PASSWORD=
   CLIENT_URL=
   DB_PASSWORD=
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

4. **Start the Server:**
   ```bash
   npm start
   # or, for development mode
   npm run dev
   ```

5. **Test the API:**
   Use tools like Postman or Insomnia to test the API endpoints.

## Deployment
The backend is deployed on **Vercel**, and the landing page for password reset is also hosted on Vercel. Ensure the `CLIENT_URL` in the `.env` file points to the correct deployment URL for the landing page.

## Development Guidelines

1. **Code Style:** Follow a consistent coding style using ESLint and Prettier.
2. **Branching Strategy:**
   - `main`: Production-ready code.
   - `dev`: Active development branch.
   - Feature branches: Use `feature/` prefix for new features.
3. **Commit Messages:** Use descriptive commit messages.
4. **Peer Reviews:** All code changes must be reviewed by at least one other team member.

## Testing

Currently, there are no tests implemented for this project. Future iterations may include unit and integration tests to ensure code quality and reliability.

## Contributors
- **Group 16 Members:**
    - Member 1: [Biagetti Matias](mailto:mbiagetti@uade.edu.ar)
    - Member 2: [Dall Acqua Emiliano](mailto:edallacqua@uade.edu.ar)
    - Member 3: [Rodriguez Ggregorio](mailto:name3@example.com)
    - Member 4: [Guevara Facundo](mailto:faguevara@uade.edu.ar)
    - Member 5: [Blanco Nicole Camila](mailto:nicoblanco@uade.edu.ar)

## Future Improvements
- Add real-time notifications using WebSockets.
- Implement advanced search and filtering.
- Optimize database queries for performance.
- Add unit and integration tests.

## License
This project is developed as part of the academic curriculum at UADE and is intended solely for educational purposes.
