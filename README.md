# PokeRevs

## [Heroku App Deploy URL (Sprint 1)](https://pokerevs.herokuapp.com/)

## Flask and `create-react-app`

## Requirements

1. `npm install`
2. `npm install react-router-dom`
3. `npm install prop-types`
4. `npm install @mui/material @emotion/react @emotion/styled`
5. `npm install react-bootstrap bootstrap@5.1.3`
6. `pip install -r requirements.txt`

<details><summary>Linting</summary>

## eslint

1. Every test.js ignores undefined function because tests are seen as undefined but interpretted correctly by npm tests
2. Backend.js ignores no-unused-vars because some response data may be used later down the line.
3. Pokemon.js ignores jsx-key because there is no use for a key prop in the iterator at the moment.
4. Search.js, Pokemon.js, and Profile.js have disabled exhaustive-deps, because UseEffect has an empty list as second argument (meaning no dependency). Inside of the UseEffect hook itself we are just utilizing UseState variables to initialize stuff, and would prefer not to invoke useEffect every time those variables are updated.

## pylint

1. All .py files ignore invalid-name and missing-function-docstring--the former because we adhere to camelCase naming convention instead of snake case (at least consistently); the latter because the code functionality changes a lot in agile development.
2. app.py: disable=invalid-envvar-default is ignored because of the default case--pylint is worried that we may be supplying a non-string (which is not the case)
3. dbhandler.py: no-self-argument and no-member are ignored because DB is acting as a static class to handle any database interactions--no instantiation is involved, and therefore no self variables are created.
4. dbhandler.py: missing-class-docstring is ignored because agile framework again.
5. dbhandler.py: too-many-arguments and no-method-arguments are disabled: the former because the number of arguments will likely change in the future (in which case we are likely going to pass a dictionary containing the data instead); the latter because the method in question is a utility function that prints the state of the database, and requires no arguments.
6. dbhandler.py: not-an-iterable is ignored because reviews is actually iterable but not detected.
7. dbhandler.py: too-many-locals is ignored because the method in question is only for populating the database--it is called outside of the context of the app and therefore storing all of them in a single object would only obfuscate the information.
8. models.py: no-member is ignored because pylint_flask_sqlalchemy is responsible for linting that.
9. models.py: consider-using-f-string is ignored because the repr methods documentation suggests the default return string to be formatted as '<{table} %r' %{string}.
   10 models.py: too-few-public-methods is ignored because the models are only responsible for the structure of the database, DB handler is responsible for their behavior.

</details>

<details><summary>Dev Details</summary>

## Run Application

1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8080/' (or whichever port you're using)

## Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

</details>
