# Python Based Shaderpipeline in VRED

This repository contains the demo application that was used for a presentation at the Alias Days 2023 in january.

## How to use this application

> The IDE of our choice is Visual Studio Code

> Download this repository, either as zip or with `git clone`

### Streaming App

1. Install [Node LTS](https://nodejs.org/en/download/)
2. Switch into the directory `[repository]/app`
3. Run `npm install` from there (this will install all needed dependencies)
4. Run `npm run build` to build the streaming app application. This will create a directory `build` where all the files are stored
5. In VRED WebPreferences change the following settings:
   - Base:
     - Enable Web Interface: `aktivieren`
     - Port: `8888`
   - Custom Web Root Directory:
     - Enable File Access: `aktivieren`
     - Directory: [```path-to-your-new-build-folder```]
   - Cross-Origin Resource Sharing:
     - Enable Cross-Origin-Requests: `aktivieren`
6. When VRED is running the application will be available under `localhost:8888/app.html`

> It is also possible to start the project locally with `npm run start`. This way it is not necessary to include the app into VREDs WebPreferences.

### Python Script Module

1. Copy the script located `[repository]/app/python/library/materialmapping.py`
2. In VRED Script Preferences add the line `from materialmapping import MaterialMapper`
3. See python script file for more information

### Other Data

1. Copy the material mappings from `[repository]/app/python/material-mapping/*` to `C:/alias-days-shader-pipeline/material_mappings/*`
2. Copy the CAD files from `[repository]/cad/*` to `C:/alias-days-shader-pipeline/cad/*`

> You can also change the paths in `[repository]/app/src/components/material-mapping/MaterialMapper.js` and `[repository]/app/src/components/import/Import.js` to point to the correct directories

# Additional Information about this Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
