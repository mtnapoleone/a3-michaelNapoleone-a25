Car Manager | CS4241 Assignment 3

Your Render (or alternative server) link e.g. http://a3-joshua-cuneo.render.me

- The goal of this application is to act as a car manager for people who sign in through github to store information about cars they own and their performance 
- Some challenges were: Auth0 is annoying to use because it will not actually log me out I have to clear the cookies and cache every time
- Authentication: Auth0 because I have been in a group in Soft Eng that has used it before so I wanted to actually learn how it works too.
- CSS Framework: Tailwind because I have experience with it from Soft Eng
  - I made it use the font Roboto with fontFamily
- Middleware:
  - express.json - lets the server read JSON data
  - .static  - acts as the bridge between frontend and backend
  - session - keeps track of who's logged in across page loads
  - passport - handles logging in (and with github)
  - ensureAuthenticated - blocks access to car data unless logged in

Technical Achievements

    Tech Achievement 1: I used OAuth authentication via the GitHub strategy
    Tech Achievement 2: Achieved 100% on Lighthouse

Design/Evaluation Achievements

    N/A, already have full credit