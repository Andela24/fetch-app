# 🐶 Fetch Dog Finder

A React application that allows users to browse and find adoptable dogs from shelters. Users can search through available dogs, filter by breed and age, add favorites, and get matched with a dog for adoption.

# 💡 Features

* User authentication with name and email
* Browse available shelter dogs with pagination
* Filter dogs by breed and age
* Sort results by breed, name, or age (ascending/descending)
* Add favorite dogs to a personalized list
* Generate a match from your favorites list
* Responsive design for all screen sizes

# 👩🏽‍💻 Technologies Used

* React.js
* React Router for navigation
* Fetch API for data fetching
* CSS for styling

# Installation and Setup

* Node.js (v14.0.0 or higher)
* npm (v6.0.0 or higher)

# Installation Steps

* Clone the repository
* git clone https://github.com/Andela24/fetch-app.git
* cd fetch-app

# Install dependencies
* npm install
* nvm install 18
* nvm use 18

* Start the development server
* npm run dev

### Open your browser and visit http://localhost:5173/

API Integration
This application integrates with the Fetch API service. The endpoints used include:

* POST /auth/login - Authentication
* POST /auth/logout - Logout
* GET /dogs/breeds - Get list of all dog breeds
* GET /dogs/search - Search dogs with filters
* POST /dogs - Get details for specific dogs
* POST /dogs/match - Generate a match from favorite dogs

* Create a production build
* npm run build

* Troubleshooting
* If you encounter issues with the application:

* Authentication Issues: If you're experiencing 401 Unauthorized errors, try clearing your browser cookies and restarting the application.
* API Connection Issues: Ensure you have a stable internet connection and that the API endpoints are accessible.
* Build Issues: If the build fails, try deleting the node_modules folder and package-lock.json file, then run npm install again.

# License
* This project is licensed under the MIT License - see the LICENSE file for details.

Fetch API for providing the dog data
React for the UI library
React Router for navigation