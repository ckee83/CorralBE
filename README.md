# CorralBE

a [Sails](http://sailsjs.org) application

## Setup

If you just pulled this repository, you will need to install the dependencies and create a local.js

### Installing the Dependencies

**Windows, Mac, Linux**

- In command prompt, navigate to the root directory (where app.js is)
- Type `npm install` and hit enter
- That's all! (It will take a moment)


Bcrypt depends on node-gyp, Visual Studio (express works), and Python 2.7

You will have to do the following:

- Install Python 2.7
- Install Visual Studio
- Install node-gyp using `npm install -g node-gyp --save`
	*If it complains that Python isn't found, you can use the following to set the path:
		`node-gyp --python /path/to/python2.7`

### Creating a local.js
- In the config folder (rootFolder/config) there is a file called localDefault.js
- If you know what you are doing, you can create a custom local.js file.
- If not, you can copy localDefault.js, then rename the copy 'local.js'

### Creating an Administrator Account
(temporary)

- Locating the 'create' function within UserController.js
- Find the commented code that sets the admin boolean to true
- Uncomment it
- After creation, uncomment the code again