# CRUD Application

### Description
This is a web application built with Node.js, Express, and MongoDB that allows users to create, view, edit, and delete code snippets. Anonymous users can browse all public snippets, while authenticated users can manage their own snippets securely. The application includes user authentication, session-based authorization, and flash messages for user feedback. It also implements proper HTTP status codes and security measures to protect against unauthorized access. Built with EJS templates, the interface is simple and user-friendly.  

### Instructions to download and run:
1. Clone the repo to any location on your computer.

2. Create a ``".env"`` file to connect the application to a MongoDB Atlas database:
    ```
    MONGO_URI='mongodb_atlas_project_URI'
    SESSION_SECRET='session_key'
    ```

3. Type the command below to run it:  
    ```
    npm start
    ```

4. The website of the application can be accessed by clicking on the link that will appear in the terminal.

### Linters
* Run the linters by the command **npm run lint** to verify that the codes contain no errors.  

The application follows modern coding standards with ESLint compliance.  
