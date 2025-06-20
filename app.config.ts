export default {
  name: "PrepBuddy",
  slug: "prepbuddy-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png", // Add your logo here
  splash: {
    image: "./assets/splash.png",
    backgroundColor: "#ffffff"
  },
  themeColor: "#0072F5", // Example brand blue
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
};
