# React Demo Chatbot

## Introduction
This project is a demo for React, which contains a chatbot function using the `sdk-js`. This demo will show you how to use `sdk-js` and integrate a chatbot into a React project.

## Before Setup
Clone [react-demo-chatbot](https://github.com/k-ai-Documentation/react-chatbot-demo)

Ensure your directory structure looks like this:
```
|-your root directory
    |-react-chatbot-demo
```
Open a terminal and run the following commands:
```bash
cd react-chatbot-demo
```

Add your keys to the `.env` file.

If you are using the SaaS version, you need 3 keys (`organizationId`, `instanceId`, `apiKey`).

If you are using the Premise version, you need a `host` and an API key (optional depending on your enterprise settings).

See more about SaaS and Premise versions [here](https://github.com/k-ai-Documentation/sdk-js#usage-guide).

```bash
# SaaS version configuration
VITE_REACT_APP_ORGANIZATION_ID = ''
VITE_REACT_APP_INSTANCE_ID = ''
VITE_REACT_APP_API_KEY = ''

# Premise version configuration. Host is required; API key is optional.
# VITE_REACT_APP_HOST = ''
# VITE_REACT_APP_API_KEY = ''
```

## Installation
```bash
npm install
```

### Start Development Server
```bash
npm start
```
You can modify parameters in the `.env` file to adjust search results.
```bash
# If you want to allow search results from multiple document sources, set this to true.
VITE_REACT_APP_MULTI_DOCUMENTS=true
```

## How to Use [sdk-js](https://github.com/k-ai-Documentation/sdk-js/tree/version2.0)

### Installation
Make sure you have installed `sdk-js`:
```bash
npm install
```
Check your `package.json` and `node_modules` to ensure `kaistudio-sdk-js` is installed.

### Environment Variables
Ensure your `.env` file contains the following variables:
```bash
VITE_REACT_APP_ORGANIZATION_ID=''
VITE_REACT_APP_INSTANCE_ID=''
VITE_REACT_APP_API_KEY=''
```

### Importing and Using the SDK in React
In your React component file, import the `kaistudio-sdk-js`:
```js
import { KaiStudio } from "kaistudio-sdk-js";
```

If you're using TypeScript, you need to define `searchResult` types.
```ts
import type { chatbot } from 'kaistudio-sdk-js/modules/Search';
```

### Create an SDK Instance
```js
const sdk = new KaiStudio({
  organizationId: process.env.VITE_REACT_APP_ORGANIZATION_ID,
  instanceId: process.env.VITE_REACT_APP_INSTANCE_ID,
  apiKey: process.env.VITE_REACT_APP_API_KEY
});
```

### Using the SDK in Methods
Here is an example of using the chatbot function within a method:
```js
const conversation = async () => {
  try {
    const result = await sdk.chatbot().conversation(
      conversationId,
      userMessage,
      multiDocuments,
      "your_user_id"
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
```

