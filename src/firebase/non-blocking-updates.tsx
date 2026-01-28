'use client';
    
import {
  DatabaseReference,
  set,
  push,
  update,
  remove
} from 'firebase/database';

/**
 * Initiates a set operation for a database reference.
 * Does NOT await the write operation internally.
 */
export function setDataNonBlocking(dbRef: DatabaseReference, data: any) {
  set(dbRef, data).catch(error => {
    console.error("Firebase SET failed:", error);
  });
}

/**
 * Initiates an push operation for a database reference.
 * Does NOT await the write operation internally.
 */
export function pushDataNonBlocking(dbRef: DatabaseReference, data: any) {
  const promise = push(dbRef, data).catch(error => {
    console.error("Firebase PUSH failed:", error);
  });
  return promise;
}

/**
 * Initiates an update operation for a database reference.
 * Does NOT await the write operation internally.
 */
export function updateDataNonBlocking(dbRef: DatabaseReference, data: any) {
  update(dbRef, data).catch(error => {
    console.error("Firebase UPDATE failed:", error);
  });
}

/**
 * Initiates a remove operation for a database reference.
 * Does NOT await the write operation internally.
 */
export function removeDataNonBlocking(dbRef: DatabaseReference) {
  remove(dbRef).catch(error => {
    console.error("Firebase REMOVE failed:", error);
  });
}
