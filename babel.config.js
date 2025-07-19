module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      "env": {
        "development": {
          "moduleName": "@env",
          "path": ".env",
          "blocklist": null,
          "allowlist": null,
          "safe": false,
          "allowUndefined": true,
          "verbose": false
        },
        "production": {
          "moduleName": "@env",
          "path": ".env",
          "blocklist": null,
          "allowlist": null,
          "safe": false,
          "allowUndefined": true,
          "verbose": false
        }
      }
    }]
  ]
};