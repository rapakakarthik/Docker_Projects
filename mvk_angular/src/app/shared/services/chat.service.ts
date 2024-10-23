import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging';

import { Observable, Subject, finalize, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // private dbPath = 'TestA';
  private dbPath = environment.firebaseURL;
  private dbAssistPath = environment.firebaseAssistURL;
  userId: number = 0;
  messagesRef!: AngularFireList<any>;
  assistRef!: AngularFireList<any>;
  sellerDetails!: SellerDetailsChat;
  constructor(
    private db: AngularFireDatabase, 
    private storage: AngularFireStorage, 
    private auth: AngularFireAuth,
    private http: HttpClient,
  ){ 
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
    let token = localStorage.getItem("token") ?? "";
    if(token) {
      // this.uniqueId = localStorage.getItem('uniqueId') ?? '';
      // // If the unique ID is not present in local storage, generate and store it
      // if (!this.uniqueId) {
      //   this.uniqueId = uuidv4();
      //   localStorage.setItem('uniqueId', this.uniqueId);
      // }
    }
  }

  signInWithEmailAndPassword(email: string, password: string, user_id?: number): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, "ytqwyiflio").then(userCredential => {
      console.log(userCredential.user?.email + " logged in firebase successfully");
      let userId = this.userId
      if(user_id) {
        userId = user_id
      }
      this.requestPermission(userId);
      // return userCredential.user?.getIdToken().then((token: string) => {
      //   return token;
      // });
    })
    .catch(error => {
      console.error("login error: " + error);
      throw error;
    });
  }

  requestPermission(userId: number) {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
          //  console.log(currentToken);
           this.updateFirebaseToken(currentToken, userId);
          } else {
           console.log('No registration token available. Request permission to generate one.');
        }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
    this.listen()
  }

  message: any =  null;
  listen() {
    const messaging = getMessaging();
    console.log("listening");
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, "ytqwyiflio").then(userCredential => {
      console.log(userCredential.user?.email + " added to firebase succesfully");
      return userCredential.user;
    })
    .catch(error => {
      console.error("signup error: " + error);
      throw error;
    });
  }

  // Not Using
  resetPassword(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email).then((res) => {
      console.log(res);
      alert('pwd sent to email')
    })
    .catch((error) => {
      console.error(error);
    });
  }

  signOut(): Promise<void> {
    console.log('called sign out method')
    return this.auth.signOut()
      .then((res) => {
        console.log('User signed out', res);
      })
      .catch(error => {
        console.error('Sign-out error:', error);
        throw error;
      });
  }

  // Not Using
  getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          resolve(user);
        } else {
          reject('User not authenticated');
        }
      });
    });
  }
  
  createBuyerDetails(obj: any, bId: number) {
    let path = "/BuyerDetails/Buyer_" + bId + "/Buyer_" + bId;
    const nodeRef = this.db.object(this.dbPath + path).snapshotChanges();
    const updateData = {activeNow: obj.activeNow, activeTime: obj.activeTime, profilePhoto: obj.profilePhoto}
    return this.callPromise(nodeRef, obj, path, updateData)
  }

  updateBuyerDetails(bId: number, activeNow: boolean, activeTime: number) {
    let path = "/BuyerDetails/Buyer_" + bId + "/Buyer_" + bId;
    const nodeRef = this.db.object(this.dbPath + path);
    return nodeRef.update({activeNow: activeNow, activeTime: activeTime})
  }

  createMessage(message: any, cId: number, uId: number, bId: number): any {
    let path = "/BuyerSellerMsgs/Seller_" + cId + "_" + uId + "/Buyer_" + bId + "_" + bId;
    this.messagesRef = this.db.list(this.dbPath + path);
    const newNodeRef =  this.messagesRef.push({});
    const newNodeId = newNodeRef.key;
    message['messageId'] = newNodeId;
    if(newNodeId != null) {
      return this.messagesRef.update(newNodeId, message);
    }
  }

  uploadAssistImage() {
    return this.http.post(`${environment.apiUrl}/update-customer-support-chat-list`, {fk_crm_user: 'id', fk_buyer_id: this.userId})
  }

  uploadImage(selectedFile: any, message: any, cId: number, uId: number, bId: number) {
    if (selectedFile) {
      let path = "/MessageImages/Seller_" + cId + "_" + uId + "/Buyer_" + bId + "_" + bId;
      let filePath = this.dbPath + path + selectedFile.name;
      // let filePath = `UploadsSample23/${selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, selectedFile);

      // Get the file download URL
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((downloadURL) => {
            message.filePath = downloadURL;
            this.createMessage(message, cId, uId, bId).then(() => {
            })
            // this.downloadURL = downloadURL;
            // this.saveDownloadURLToDatabase(downloadURL);
          });
        })
      ).subscribe(res => {
      });
    }
  }

  // saveDownloadURLToDatabase(downloadURL: string, cId: number, uId: number, bId: number) {
  // Save the download URL to the Realtime Database
  //   let path = "/BuyerSellerMsgs/Seller_" + cId + "_" + uId + "/Buyer_" + bId + "_" + bId;
  //   this.messagesRef = this.db.list(this.dbPath + path);
  //   return this.messagesRef.push({ downloadURL });
  // this.db.list('SeeUploads23/Uploads').push({ downloadURL });
  // }
  // Get all messages

  // getImageUrls() {
  //   const imagesRef = this.db.list('SeeUploads23/Uploads');
  // }

  getMessages(cId: number, uId: number, bId: number): Observable<any> {
    let path = "/BuyerSellerMsgs/Seller_" + cId + "_" + uId + "/Buyer_" + bId + "_" + bId;
    this.messagesRef = this.db.list(this.dbPath + path);
    return this.messagesRef.valueChanges();
  }

  getMessages1(cId: number, uId: number, bId: number): Observable<any> {
    let path = "/BuyerSellerMsgs/Seller_" + cId + "_" + uId + "/Buyer_" + bId + "_" + bId;
    this.messagesRef = this.db.list(this.dbPath + path);
    const pathToMsg = "/SellerBuyers/Seller_" + cId + "/Seller_" + uId + "/Buyer_" + bId + "_" + bId;
    setTimeout(() => {
      this.db.object(this.dbPath + pathToMsg).update({ newMsgCount: 0})
    },1000)
    // this.messagesRef = this.db.list("/ChatModuleLive/BuyerSellerMsgs/Seller_761_95/Buyer_627_627");
    return this.messagesRef.valueChanges();
  }

  getSellerList(bId: number) {
    let path = "/BuyerSellers/Buyer_" + bId + "/Buyer_" + bId;
    this.messagesRef = this.db.list(this.dbPath + path);
    return this.messagesRef.valueChanges();
  }

  createBuyerSellers(obj: any, bId: number, cId: number, uId: number) {
    const path = "/BuyerSellers/Buyer_" + bId + "/Buyer_" + bId + "/Seller_" + cId + "_" + uId;
    const nodeRef = this.db.object(this.dbPath + path).snapshotChanges();
    return new Promise<void>((resolve, reject) => {
      nodeRef.pipe(take(1)).subscribe((snapshot) => {
        if (snapshot.payload.exists()) {
          this.db.object(this.dbPath + path).update({lastMessage: obj.lastMessage, lastMsgTime: obj.lastMsgTime})
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          this.db.object(this.dbPath + path).set(obj)
          .then(() => resolve())
          .catch((error) => reject(error));
        }
      });
    });
  }
  // createBuyerSellers(obj: any, bId: number, cId: number, uId: number) {
  //   const path = "/BuyerSellers/Buyer_" + bId + "/Buyer_" + bId + "/Seller_" + cId + "_" + uId;
  //   const nodeRef = this.db.object(this.dbPath + path);
  //   return nodeRef.set(obj);
  // }


  createSellerBuyers(obj: any, bId: number, cId: number, uId: number) {
    const path = "/SellerBuyers/Seller_" + cId + "/Seller_" + uId + "/Buyer_" + bId + "_" + bId;
    const nodeRef = this.db.object(this.dbPath + path).snapshotChanges();

    return new Promise<void>((resolve, reject) => {
      nodeRef.pipe(take(1)).subscribe((snapshot) => {
        if (snapshot.payload.exists()) {
          const lastMessage = obj.lastMessage
          const count = snapshot.payload.child('newMsgCount').val() || 0;
          this.db.object(this.dbPath + path).update({ newMsgCount: (count + 1), lastMessage: lastMessage, lastMsgTime: obj.lastMsgTime})
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          this.db.object(this.dbPath + path).set(obj)
          .then(() => resolve())
          .catch((error) => reject(error));
        }
      });
    });
    
  }

  createSellerDetails(obj: any, cId: number, uId: number) {
    let path = "/SellerDetails/Seller_" + cId + "/Seller_" + uId;
    const nodeRef = this.db.object(this.dbPath + path).snapshotChanges();
    const updateData = {}
    return this.callPromise(nodeRef, obj, path, updateData);
  }

  getActiveStatus(cId: number, uId: number): Observable<any> {
    let path = "/SellerDetails/Seller_" + cId + "/Seller_" + uId;
    const nodeRef = this.db.object(this.dbPath + path);
    return nodeRef.valueChanges();
  }


  callPromise(nodeRef:any, obj: any, path: any, updateData: any) {
    return new Promise<void>((resolve, reject) => {
      nodeRef.pipe(take(1)).subscribe((snapshot: any) => {
        // if (snapshot.payload.exists()) {
        //   console.log(snapshot.payload)
        //   this.db.object(this.dbPath + path).update(updateData)
        //     .then(() => resolve())
        //     .catch((error) => reject(error));
        // } 
        // else {
            this.auth.currentUser.then((user) => {
            if (user) {
               user.getIdToken().then((token) => {
                obj["fcmRegToken"] = token;
                // console.log(token)
                this.db.object(this.dbPath + path).set(obj)
                .then(() => resolve())
                .catch((error) => reject(error));
              });
            }
            return Promise.reject("Firebase throws an error")
          });
        // }
      });
    }); 
  }
  // createSellerDetails(obj: any, cId: number, uId: number) {
  //   let path = "/SellerDetails/Seller_" + cId + "/Seller_" + uId;
  //   const nodeRef = this.db.object(this.dbPath + path);
  //   return this.auth.currentUser.then((user) => {
  //     if (user) {
  //       return user.getIdToken().then((token) => {
  //         obj["fcmRegToken"] = token;
  //         return nodeRef.set(obj)
  //       });
  //     }
  //     return Promise.reject("Firebase throws an error")
  //   });
  // }
  
  getCallChatWrap() {
    return this.sellerDetails;
  }

  public chatSource = new Subject<SellerDetailsChat>();
  public chatMsg$ = this.chatSource.asObservable();
  public setCallChatWrap(details: SellerDetailsChat) {
    this.sellerDetails = details;
    this.chatSource.next(details);
  }

  deleteObject() {
    const objectPath = '/123'; // Replace with the actual path to your object    
    this.db.object(objectPath).remove()
      .then(() => {
      })
      .catch((error: any) => {
        console.error('Error deleting object:', error);
      });
  }

  uniqueId: string = '';
  updateFirebaseToken(token: string, userId: number): void {

    let uniqueId = localStorage.getItem('uniqueId') ?? '';
    // If the unique ID is not present in local storage, generate and store it
    if (!uniqueId) {
      uniqueId = uuidv4();
      localStorage.setItem('uniqueId', uniqueId);
    }

    const obj = {
      device_type: "3",
      user_type: "buyer",
      firebase_token: token,
      device_token: uniqueId,
      user_id: userId
    }
    this.http.post(`${environment.apiUrl}/update-firebase-token`, obj).subscribe({
      next: (result: any) => {
        if(result.status === 200) {
          console.log(result);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('firebase update token error', error.message);
      }
    });
  }

  pushNotification(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/push-notification`, obj)
  }

  updateBuyerPhoto(obj: any, bId: number) {
    let path = "/BuyerDetails/Buyer_" + bId + "/Buyer_" + bId;
    const nodeRef = this.db.object(this.dbPath + path).snapshotChanges();
    const updateData = {activeNow: obj.activeNow, activeTime: obj.activeTime, profilePhoto: obj.profilePhoto}
    return this.callPromise(nodeRef, obj, path, updateData)
  }


  updateChatlistApi(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-chat-list`, obj)
  }

  unregisterFirebaseToken() {
    const messaging = getMessaging();    
    getToken(messaging, 
      { vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
          console.log('Unregistering token...');
          deleteToken(messaging).then(() => {
            console.log('Token unregistered successfully.');
          }).catch((err) => {
            console.log('Error while unregistering token. ', err);
          });
        } else {
          console.log('No registration token available. Unable to unregister.');
        }
      }
    ).catch((err) => {
      console.log('An error occurred while retrieving token for unregistering. ', err);
    });
  }

  // Assist Chat
  ////////////////////

 
  getAssistMessages(bId: number) {
    let path = "/AssistBuyerMessages/A_00" + "/B_" + bId;
    const messagesRef = this.db.list(this.dbAssistPath + path);
    return messagesRef.valueChanges();  
  }
  
  
  createAssistBuyerMessages(obj: any, bId: number) {
    let path = "/AssistBuyerMessages/A_00" + "/B_" + bId;
    this.assistRef = this.db.list(this.dbAssistPath + path);
    const newNodeRef =  this.assistRef.push({});
    const newNodeId = newNodeRef.key;
    obj['messageId'] = newNodeId;
    if(newNodeId != null) {
      return this.assistRef.update(newNodeId, obj);
    }
    return Promise.reject("no node");
  }

  createAssistBuyerDetails(obj: any, bId: number): Promise<any> {
    let path = "/BuyersDetails/B_" + bId;
    const nodeRef = this.db.object(this.dbAssistPath + path).snapshotChanges();
    // const updateData = {activeNow: obj.activeNow, activeTime: obj.activeTime, profilePhoto: obj.profilePhoto}
    return new Promise<void>((resolve, reject) => {
      nodeRef.pipe(take(1)).subscribe((snapshot) => {
        if (snapshot.payload.exists()) {
          this.db.object(this.dbAssistPath + path).update({activeNow: obj.activeNow, activeTime: obj.activeTime, profilePhoto: obj.profilePhoto})
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          this.auth.currentUser.then((user) => {
            if (user) {
               user.getIdToken().then((token) => {
                obj["fcmRegToken"] = token;
                this.db.object(this.dbAssistPath + path).set(obj)
                .then(() => resolve())
                .catch((error) => reject(error));
              });
            }
          });
        }
      });
    });
  }

  updateAssistBuyerDetails(bId: number, activeNow: boolean, activeTime: number) {
    let path = this.dbAssistPath + "/BuyersDetails/B_" + bId;
    const nodeRef = this.db.object(path).snapshotChanges();
    nodeRef.pipe(take(1)).subscribe((snapshot) => {
      if (snapshot.payload.exists()) {
        this.db.object(path).update({activeNow: activeNow, activeTime: activeTime});
      }
    });
  }
  

}


export interface SellerDetailsChat {
  sellerAccountId: number,
  sellerId: number,
  companyName: string,
  companyLogo: string
}