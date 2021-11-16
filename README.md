# PokeRevs
## Heroku app: [https://pokerevs.herokuapp.com/]

## Flask and `create-react-app`

## Requirements

1. `npm install`
2. `npm install react-router-dom`
3. `npm install prop-types`
4. `npm install @mui/material @emotion/react @emotion/styled`
5. `npm install react-bootstrap bootstrap@5.1.3`
6. `pip install -r requirements.txt`

## Run Application

1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8080/' (or whichever port you're using)

## Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`
