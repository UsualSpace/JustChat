# Setup
Once you have navigated to the frontend directory, run "npm install". Then create a folder in the same directory called ".env". Inside ".env", create an environment variable called VITE_SERVER_URL and set it equal to the link to your backend server. For example: "http://localhost:4000", where the "4000" will be the port number matching the PORT variable specified in the backend directory's ".env" file once you create it. **Make sure to not append to the url with a forward slash ('/')**.
# Running the frontend
To run the frontend server, make sure you are within the "frontend" directory. Simply run the command "npm run dev", and the vite development server will start. To open up a tab for the sign up page of "JustChat", type in the letter 'o' and press enter.
# Testing
To run the automated tests for the frontend (mostly complete), simply run "npm test".
