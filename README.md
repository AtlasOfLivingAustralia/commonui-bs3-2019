# commonui-bs3-2019
ALA header, footer, theme and javascript files required for 2019 website refresh

## Setting up development environment

### Repository cloning
This repository contains a couple of git submodules. Therefore, there is a bit more work than just cloning repo from 
github. Run the following commands.
 
`git clone --recurse-submodules https://github.com/AtlasOfLivingAustralia/commonui-bs3-2019.git`

`cd commonui-bs3-2019`

`git submodule foreach --recursive 'git checkout commonui-bs3-2019'`

_Above command will checkout the correct branch of submodule._

### Working with submodule
Make sure changes submodules are made on `commonui-bs3-2019` branch. Then publish those changes to github 
using `git push`. In order for others to checkout your change, run the following command on the root repository - `commonui-bs3-2019`.

`git add bootstrap-sass`

`git add ala-wordpress-2019` 

### Installing dependencies
Install dependencies using yarn.

`brew install yarn`

`cd PROJECT-PATH`

`yarn install`

### Building project
Build project to generate CSS from SCSS, compress and concatenate files. The tool used to build project is Gulp.

`./node_modules/.bin/gulp build`

### Serve built files
You might want to test the integration of built files with applications like ala-hub, specieslist etc locally. 
The built in server will do it. The address is `http://localhost:8099`.

`node server.js` 

Example usage - `http://localhost:8099/css/jquery-ui.css`

### Test page
The project has a test page to visualise changes. Use the following link.

`http://localhost:8099/testPage.html`

### Adding a dependency
Add a npm library using `yarn`. Yarn is used to preserve the version of the dependency across installations of this repo.

`yarn add xxx`

### Auto build
It is possible to build project after editing a file automatically. Use the following command.

`./node_modules/.bin/gulp watch`
