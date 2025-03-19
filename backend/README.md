# Setup
Once you have navigated to the "backend" directory, run "npm install". Then create a file in the same directory called ".env". Inside ".env", create 3 environment variables called "MONGO_URI", "PORT", "FRONTEND_URL" and set their values like so:
-  MONGO_URI = [insert the uri/url to your mongodb database here].
-  PORT = [insert a port number of your choosing]
-  FRONTEND_URL = [insert the url of your frontend server, in this case use the url given to you by Vite when running "npm run dev" in the "frontend" directory]
# Running the backend
To run the backend server, make sure to be inside the backend directory, and run the command "node ." A successful startup message should show telling you the database has connected and which port it is listening on.
