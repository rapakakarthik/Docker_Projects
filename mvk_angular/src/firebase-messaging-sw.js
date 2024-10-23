importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");
firebase.initializeApp({
 apiKey: "AIzaSyDiqCiiTs-aI5Amg_8cDJ0GAQ9htVUDqGY",
 authDomain: "myverkoperlivev1.firebaseapp.com",
 projectId: "myverkoperlivev1",
 storageBucket: "myverkoperlivev1.appspot.com",
 messagingSenderId: "587126445002",
 appId: "1:587126445002:web:02f76eeba25a760925b533",
 measurementId: "G-EF1TERP8BD"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('onBackgroundMessage ', payload);
    // Customize notification here
     const {title, body} = payload.notification;
     const notificationTitle = title;
     const notificationOptions = {
        body: body,
        icon: '/firebase-logo.png'
    };
    // self.registration.showNotification(notificationTitle,
    //     notificationOptions);
});