# Order Fulfillment App

This application mimics a real world example use case for any business that needs organization and action in their order fulfillment. In it a user can generate an order with line items and create packages and shipments to send these items.

The basic application flow is as follows:

- Create a new order
- Create a new package within that order
- Add line items to that package or mulitple packages
- Mark these packages as completed
- Create a new shipment for that order
- Add the completed packages to that shipment or multiple shipments
- Mark the shipments as completed

As you move through this flow, the statuses of the orders, line items, pacakges, and shipments will update accordingly, changing the state of actionable objects.

## Tech Stack

**Client:** React Native, Expo, Tamagui, SQLite

## Run Locally

Clone the project

```bash
  git clone https://github.com/onieronaut/Order-Fulfillment-App.git
```

Go to the project directory

```bash
  cd Order-Fulfillment-App
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

In the output, you'll find options to open the app in a

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

- Please note the current iteration of this application will only function using Expo Go or a mobile device simulator due to the use of `expo-sqlite`. The web application version is not supported.

## Optimizations

Future optimizations include:

- Adding toast notifications on successful database actions
- Adding QR Code technology to scan items with the device camera
- Interacting with a shipping API to integrate tracking data on shipments
- Adding a pickup shipment option
- Extending the status management system to be more detailed
- Add support for web application by implementing local storage usage
