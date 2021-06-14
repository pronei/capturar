# Capturar

[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/GPL-3.0/)

A simple web application that lets you record and store videos using a compatible camera device. Includes user signup
and session-based login.

Things you may want to cover:

## Local setup:
The database used locally is SQLite3,

1. Install Ruby 2.7.3 and bundler
You may have to use RVM in case the specified version is not the default in your OS's package manager.
After installing ruby, install bundler using `gem install bundler`.

2. Install SQLite3 using `sudo apt install sqlite3`

3. Install `nodejs` and `yarn`

4. Clone the repository
```
git clone https://github.com/pronei/capturar.git && cd capturar
```

5. Install development and test gems in the Gemfile
```
bundle install --without production
```

6. Install JavaScript dependencies
```
bundle exec yarn install
```

7. Migrate the database
```
bin/rails db:migrate
```

8. Run the test suite
```
bin/rails test
```

9. Start the server on port 3000
```
bin/rails server
```

10. View the app site on `localhost:3000` on your web browser

## Deploy on Heroku:
The database used for production is PostgreSQL 

1. Create a free account on Heroku. 
2. Create a new app.
3. Install Heroku CLI using `sudo apt install heroku-cli`
4. Login, set the remote and push changes
```
heroku login
heroku git:remote -a <your_herokuapp_name>
git push heroku master
```
