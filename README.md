
# Real-Time Chat Mobile App (React Native CLI)

This is the React Native CLI mobile application for the Real-Time Chat project, providing a native interface for real-time communication on Android devices.

## ✨ Features

- **User Authentication**: Login and register with a username and password, or continue as a guest.
- **Join/Create Rooms**: View available chat rooms, join existing ones, or create new ones.
- **Real-Time Messaging**: Send and receive messages instantly within selected rooms.
- **Online Users**: Displays a list of users currently online in the active room.
- **Chat History**: Loads previous messages when a user joins a room.
- **Typing Indicator**: Shows "User is typing..." when someone types.

## 🧰 Tech Stack

- **React Native CLI**: For building native mobile applications.
- **Socket.io Client**: For real-time, bidirectional communication with the Node.js backend.
- **@react-navigation/native-stack**: For screen navigation.
- **@react-native-async-storage/async-storage**: For persisting user session data.
- **react-native-dotenv**: For managing environment variables.
- **JavaScript/TypeScript**: Core language for development.

## 🚀 Getting Started

Follow these steps to set up and run the mobile application locally on an Android emulator or device.

### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** or **Yarn**
- **React Native CLI** development environment setup (Android Studio, SDKs, etc.). Refer to the [official React Native CLI documentation](https://reactnative.dev/docs/environment-setup) for detailed setup.
- A running instance of the **Node.js Chat Backend** (ensure it's accessible from your mobile app, typically `http://10.0.2.2:3001` for Android emulator).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/21namanpandey/chat-room-app.git
   cd chat-room-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install CocoaPods (if you plan to run on iOS, optional for Android-only):

   ```bash
   cd ios && pod install && cd ..
   ```

### Configuration (.env file)

Create a `.env` file in the root of the `chatMobileApp` directory and add the following environment variable:

```plaintext
API_URL=http://10.0.2.2:3001
```

- **API_URL**: This is the URL for your Node.js backend.
  - For **Android Emulator**, `10.0.2.2` is the special alias for your host machine's localhost.
  - For a **physical Android device**, you'll need to use your host machine's actual IP address (e.g., `http://192.168.1.X:3001`).

### Running the Application (Android)

1. Start the Metro Bundler:

   ```bash
   npm start
   ```

2. Run on Android device/emulator (in a new terminal tab/window):

   ```bash
   npx react-native run-android
   ```

This will build the app and install it on your connected Android device or running emulator.


## 🤝 Contributing

Feel free to open issues or pull requests.
