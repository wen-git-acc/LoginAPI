import { firestore } from "../../Utility/Firestore/Firestore";
import {DocumentReference} from "@firebase/firestore-types"
import { userInformationType } from "../config/UserDataConfig";
import { isUserEmailExistReturnType as isUserExistReturnType, loginTokenBodyType } from "../config/generalModelHeperConfig";
// Function to validate the request body dynamically with generics
export function isValidRequestBody<T>(body: any): body is T {
    // Check if the 'body' object conforms to the 'T' interface
    return typeof body === 'object' && Object.keys(body).every((key) => key in body as T);
  }
  

export async function userVerification({identifier, password}: loginTokenBodyType){
  // const isEmailExist = await isUserExist(identifier);
};

export async function isUserExist(userEmail:string):Promise<isUserExistReturnType>{
  const collectionName = "UserData";
  const userEmailRef: DocumentReference = await firestore.collection(collectionName).doc(userEmail);
  let isValidResponse  = {} as isUserExistReturnType;
  try {
    const docSnapshot = await userEmailRef.get();
    if (docSnapshot.exists){
      const data = docSnapshot.data();
        isValidResponse = {
          isValid:true,
          userData: data as userInformationType
        }
    } else {
      isValidResponse =  {
        isValid:false,
        userData: {} as userInformationType
      }
    }
    return isValidResponse
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export function isEmailFormat(email:string) : boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export async function pushSignUpData<T>(data:T, docName: string){
  const collectionName = "UserData";
  return await firestore.collection(collectionName).doc(docName).set(data);
}