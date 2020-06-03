# J.A.R.V.I.S. Frontend App

This project was created as a Vue.js frontend application for already existing Spring Boot backend. 
Application serves as personal assistant. User can create notes, events, polls and work with those entities.
Frontend application also provides an ASCII art generator for converting images to ASCII art.

## Usage

The usage of the application is pretty straight forward, but some scenarios are described bellow.

When user is not logged in, he is redirected to the login screen. After logging in with Discord account, user is 
redirected to the page, he wanted to visit before the redirect to the login.

On the home page, there is greeting based on current time, and a random geek joke from [JokeAPI](https://sv443.net/jokeapi/v2).

There is also a digital clock at the top of the screen.

On *Notes*, *Events*, *Polls* views can user see filters and list of items based on the filter selection. User can perform
various actions with each entity, but everything should be clear from the UI.

*Picture2ASCII* gives user just upload input and after an upload of an image, success sound should be played and ASCII art
created from uploaded image should be seen and ready for a download.

## Code structure

Source of the project is structured into different folders based on the functionality. 
For better orientation in project `src` folder see lines bellow.

 - `main.js` - application entry point, Vue instance is created here
 - `App.vue` - base layout of the application
 - `router.js` - definition of the routes in the application, contains also control management for user permission for different views
 - `store/` - scripts here store application state (info about logged user)
 - `services/`
   - `api.service.js` - communication with Spring Boot backend
   - `notification.service.js` - displaying of notification in Bootstrap toasts
   - `storage.service.js` - manipulates with the browser's local storage
   - `user.service.js` - performs authentication actions
 - `views/` - all views are stored here, `LoginView.vue` is the only public view, others require user authentication, 
 some are available only for administrators (see `router.js`)
 - `components/` - all components used in views are stored here
 
## Vue components structure

Vue components are stored in `.vue` files which are somewhat special. Their main identification sign is occurrence of tags 
 - `<template></template>` - definition of the structure of the component in HTML-based template syntax 
 - `<script></script>` - definition of the dynamic data, methods and importing/exporting components
 - `<style></style>` *(optional)* - definition of the component styles, can be CSS or SCSS based on the framework configuration

See https://vuejs.org/ for more information.
 
## Main dependencies

 - **Vue.js**
 - **Vuex** - storing application state
 - **Vue Notification** - popup notifications (in toasts)
 - **Vue Router** - routing
 - **Vuelidate** - form validation
 - **Vue Datetime** - datetime pickers
 - **BootstrapVue** - basic appearance of the application
 - **Axios** - API calls