import { firestore } from "../../Utility/Firestore/Firestore";
import {
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore-types";
import { userInformationType } from "../config/UserDataConfig";
import {
  isUserEmailExistReturnType as isUserExistReturnType,
  loginTokenBodyType,
} from "../config/generalModelHeperConfig";

// Function to validate the request body dynamically with generics
export function isValidRequestBody<T>(body: any): body is T {
  // Check if the 'body' object conforms to the 'T' interface
  console.log(body);

  const bodyKeys = Object.keys(body);

  if (bodyKeys.length == 0) {
    return false;
  }

  const isKeysCorrect = bodyKeys.every((key) => {
    // Check if the key exists and if its value is not undefined or null
    return key in body;
    //&& body[key] !== undefined && body[key] !== nullv
  });

  if (!isKeysCorrect) {
    return false;
  }

  return (
    typeof body === "object" &&
    Object.keys(body).every((key) => (key in body) as T)
  );
}

export async function userVerification({
  uniqueIdentifier,
  password,
}: loginTokenBodyType) {
  console.log(uniqueIdentifier);
  const collectionName = "UserData";
  const isThisUserExist = await isUserExist(uniqueIdentifier);

  return isThisUserExist;
  // const isEmailExist = await isUserExist(identifier);
}

export async function isUserExist(
  identifier: string
): Promise<isUserExistReturnType> {
  const collectionName = "UserData";

  let isValidResponse = {} as isUserExistReturnType;
  // const docNameRef: DocumentReference = await firestore
  //   .collection(collectionName)
  //   .doc(docName);

  const isAEmail: boolean = isEmailFormat(identifier);

  const filterCriteria = isAEmail ? "emailAddress" : "userName";
  const docSnapshotsList: QuerySnapshot = await firestore
    .collection(collectionName)
    .where(filterCriteria, "==", identifier)
    .get();

  const dataList = docSnapshotsList.docs.map((doctSnapshot) => {
    return doctSnapshot.data();
  });

  if (dataList.length === 0) {
    isValidResponse = {
      isValid: false,
      userData: {} as userInformationType,
    };
  } else {
    const data = dataList[0];
    isValidResponse = {
      isValid: true,
      userData: data as userInformationType,
    };
  }
  console.log("Sadasd");
  return isValidResponse;
  // try {
  //   if (docSnapshot.exists) {
  //     const data = docSnapshot.data();
  //     isValidResponse = {
  //       isValid: true,
  //       userData: data as userInformationType,
  //     };
  //   } else {
  //     isValidResponse = {
  //       isValid: false,
  //       userData: {} as userInformationType,
  //     };
  //   }
  //   return isValidResponse;
  // } catch (err) {
  //   console.log(err);
  //   throw err;
  // }
}

export function isEmailFormat(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export async function pushSignUpData<T>(data: T, docName: string) {
  const collectionName = "UserData";
  return await firestore.collection(collectionName).doc(docName).set(data);
}

export function userDataColDocName(
  userEmail: string,
  userName: string
): string {
  if (!isEmailFormat(userEmail)) return "";
  return `${userEmail}:${userName}`;
}
