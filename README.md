# Custom BC discount script

## Quick start

### Prerequisites

Follow [this tutorial for](https://shopify.dev/docs/apps/selling-strategies/discounts/experience) requirements.

### Setup

After installing the requirements, run the following to start editing the script:

```shell
npm run dev
```

This will run the frontend and deploy the functions automatically (they are separate things).

The main discount script is in the file extensions/product-discount-js/src/run.js.
The main discount script is based on the GraphQL input located at extensions/product-discount-js/src/run.graphql.

## Build / Deploy
The frontend part of the app have separated deployment from the backend part.

### React / Remix
If you've made changes to React/Remix part of the app located in the "app" folder, 
you will have to update the app on the server that it is hosted.

1. Commit your changes to github
2. Login to the server (ask [Eric](eric.exts@gmail.com) for the PEM file)
```shell
ssh -i ./bc-discount-app.pem ubuntu@ec2-18-119-113-215.us-east-2.compute.amazonaws.com
```
3. Go to the app folder
```shell
cd apps/discount-app
```
4. Pull you changes from github
```shell
git pull
```

BTS:
I followed [this tutorial](https://medium.com/@chris.geelhoed/how-to-deploy-node-js-shopify-apps-to-digital-ocean-4b2350840080) to get the frontend running.
1. Nginx + reverse proxy
2. PM2 process running with the following command
```shell
PORT=8080 pm2 start npm --name "discount-app" -- start
```

You're good to go :)

### Extensions / Functions / Discounts
I don't know why Shopify has so many words for basically the same thing. Welp. Let's keep going.

If you've made changes to the discount script, you've got only one thing to do:

```shell
npm run deploy
```

And you'll be good to go :)