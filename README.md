# React Native E-Commerce App

## a. Framework Choice and Why

This application is built using React Native, a popular framework for building cross-platform mobile applications using JavaScript and React.

As a React Native developer, I chose this framework because it allows me to build high-performance mobile applications for both Android and iOS using a single codebase while still delivering a near-native user experience.

### Why React Native?

* **Cross-Platform Development** – A single codebase works for both Android and iOS.
* **Large Ecosystem** – Strong community support and many libraries available.
* **Fast Development** – Features like hot reload make development faster.
* **Native Performance** – React Native renders native UI components.
* **JavaScript/React Based** – Easy for web developers to transition into mobile development.

The app also uses:

* **Redux Toolkit** for state management (cart management).
* **React Navigation** for screen navigation.
* **Lucide React Native Icons** for modern UI icons.
* **Lottie Animations** for improved user experience.

---

## b. How to Run the App from Scratch

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install -f
```

or


### 3. Install Android Dependencies

cd android
gradlew clean
cd ..
```

### 4. Start Metro Bundler

```bash
npx react-native start
```

### 5. Run the Application

For Android:

```bash
npx react-native run-android
```

### 6. Create Release Build (Optional)

```bash
cd android
gradlew assembleRelease
```



## c. Known Limitations

* The app currently uses **static product data** from an API (or mock data).
* No **backend authentication or user login system** is implemented.
* Cart data is stored in **Redux state only**, so it resets when the app restarts.
* No **offline support** for product data.
* Payment functionality is only a **UI simulation** and not connected to a real payment gateway.

---

## d. Future Improvements

With more development time, the following improvements could be added:

* **Persistent Cart Storage** using AsyncStorage or local database.
* **User Authentication** (Login/Signup).
* **Real Payment Gateway Integration** (Stripe, Razorpay, etc.).
* **Product Search and Filtering** functionality.
* **Wishlist Feature** for saving products.
* **Push Notifications** for offers and order updates.
* **Performance Optimization** using memoization and lazy loading.
* **Unit and Integration Testing** for better reliability.
* **Better Error Handling and Loading States**.
* **UI/UX Enhancements** such as skeleton loaders and smoother animations.

---

## Tech Stack

* React Native
* Redux Toolkit
* React Navigation
* Lucide Icons
* Lottie Animations

---

## Author

Rohit Kumar
Mobile Application Developer
