# How do I..?

## How do I start developing?
You no longer need to fork the repo.
After you've cloned the repo you'll need to create a new branch from the main branch. This is done by clicking on the 'Current branch' dropdown in github desktop and then selecting the 'New branch option'

From this point you'll need to create a branch related to what you're doing, these should be named using the following convention:

type/description-of-change

So we'll have the following types: \
feature/ - for new features \
bugfix/ - for bug fixes (but if you find a bug you should fix it in your feature branch) \
hotfix/ - for urgent fixes to the website \
docs/ - for documentation changes \
refactor/ - for code restructuring \
testing/ - for adding/modifying test files

So we'll have branches like

feature/adding-frontend-templates \
feature/adding-database-handling \
hotfix/fixing-database-handling

## How do I _Test_ the code?
After making changes, you need to test the code before pushing anything.
```npm test``` and ```npm coverage``` that do what they say on the tin, the tests will be run automatically during the pull request.

## How do I run the code?
After cloning this repo (that you better have branched from) you'll need to open the terminal in Webstorm (the Jetbrains Javascript IDE) and enter the command

```npm ci```

Once you've installed all of the dependencies required to build the project you'll be able to start the local webserver by entering the command

```npm run dev```
 
Once you run this vite will build the app and you'll have a working webapp running on a javascript server.