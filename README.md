<p align="center">
  <a href="https://telar.press/" rel="noopener" target="_blank"><img width="150" src="https://raw.githubusercontent.com/red-gold/red-gold-web/master/website/static/img/logos/telar-social-logo/profile.png" alt="Material-UI logo"></a></p>
</p>

<h1 align="center">Telar Social User Interface</h1>

> 🚧 ***IT IS UNDER ACTIVE DEVELOPMENT, current version is unstable and maybe change at any time until release of v1.0.0.*** 🚧
<br>⚠️ ***DO NOT USE IN ANY PRODUCTION ENVIRONMENT!!!*** ⚠️

**Compatible with OpenFaaS**

## Demo
https://social.telar.dev

## Pre-required

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

## Running locally

1. Clone repository
```sh
$ git clone git@github.com:red-gold/ts-ui.git
```
2. Add `[127.0.0.1 social.example.com]` domain into your host file. [Doc you may refer to](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux)
3. Copy `ts-ui/docker/config/.env.secrets.init` file and set the name `.env.secrets`.
4. Config email to receive email notification for signup, reset password, etc. Please refer to [doc #2](https://github.com/Qolzam/telar-cli/blob/master/docs/ofcc-setup/8.md#2-enter-your-valid-gmail-and-password-for-sending-signupreset-password-verfication-code-to-telar-social-users)
   1. Set your smtp email`(e.g. for gmail is smtp.gmail.com:587)` and your email my@email.com

   ```sh
   $ npx envedit -s ./docker/config/.env.app_config -l smtp_email=YOUR_EMAIL_SMTP -l ref_email=YOUR_EMAIL
   ```
   
   1. Set your email password

   ```sh
   $ npx envedit -s ./docker/config/.env.secrets -l ref_email_pass=YOUR_EMAIL_PASS -b64
   ```
5. Run **back-end**
```sh
$ cd docker
$ docker-compose up

#or new docker compose installed by docker
$ docker compose up
```
5. Run **front-end**
```sh
$ yarn
$ yarn start

```


### Blog Posts
- [Telar Social one-click setup: OpenFaaS Cloud Community Cluster](https://medium.com/red-gold/telar-social-one-click-setup-openfaas-cloud-community-cluster-68814b3bf47c)
- [Apply Domain-Driven Design to microservices architecture](https://medium.com/red-gold/telar-social-media-architecture-using-domain-driven-design-for-microservices-319c514199e4)
- [Realtime Server-client interaction using OpenFaaS server-less function with Redux](https://medium.com/@qolzam/realtime-server-client-interaction-using-openfaas-server-less-function-with-redux-b38d7de75035)
- [Easy steps from OpenFaaS to your own Telar Social Media on Cloud](https://medium.com/red-gold/easy-steps-from-openfaas-to-your-own-telar-social-media-on-cloud-b0608a03d92b)

## Features
- [x] Supporting Progressive Web App
- [x] Social services, post, comment, like, connect users and etc.
- [x] Support Internationalization or Localization.

## New Changes
- [x] Support React Hooks

## Built With

  * [TypeScript](https://www.typescriptlang.org/) TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
  * [JSX/TSX](https://jsx.github.io/) This project support both *.jsx and *.tsx files. JSX is a statically-typed, object-oriented programming language designed to run on modern web browsers. Being developed at DeNA as a research project, the language has following characteristics.
  * [React](https://facebook.github.io/react/docs/hello-world.html) A javascript library for building user interfaces.
  * [Redux](http://redux.js.org/) is a predictable state container for JavaScript apps.
  * [Material-UI](http://www.material-ui.com/#/) A Set of React Components that Implement Google's Material Design.
  * [react-redux](https://github.com/reactjs/react-redux) Official React bindings for Redux.
  * [redux-saga](https://redux-saga.js.org/) is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, simple to test, and better at handling failures.
  * [React Router V6](https://github.com/ReactTraining/react-router) for routing website location
  * [Sass](http://sass-lang.com/) CSS with superpowers. Sass boasts more features and abilities than any other CSS extension language out there.
  * [InversifyJS](http://inversify.io/) InversifyJS is a lightweight (4KB) inversion of control (IoC) container for TypeScript and JavaScript apps. A IoC container uses a class constructor to identify and inject its dependencies.
  * [create-react-app](https://github.com/facebook/create-react-app) Create React App is a tool built by developers at Facebook to help you build React applications. It saves you from time-consuming setup and configuration. You simply run one command and create react app sets up the tools you need to start your React project.

## Author
  - Amir Movahedi
  
## Looking for support

For questions and support please [join our community](https://docs.google.com/forms/d/e/1FAIpQLSdkwt5pxmyCZQO0AmyAghBOdA-XBG298Pfm5Dw1xjNGaGeCYQ/viewform).

## Documents
Check out [Telar Social docs](https://red-gold.tech/docs/en/social/get_started/)

## Credits
Notification sounds from [Notification Sounds](https://notificationsounds.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Qolzam/react-social-network/blob/v0.7.0/LICENSE) file for details

