import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { CODOrder, SiteData } from '../types';

/**
 * Saves a new COD order to Firebase Cloud Firestore.
 * This ensures the order is stored in the cloud and instantly received
 * by any device with the admin dashboard open.
 */
export async function saveOrderToFirestore(order: CODOrder): Promise<boolean> {
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    const orderData = {
      ...order,
      createdAtTimestamp: Date.now(),
      syncedAt: new Date().toISOString(),
    };
    await setDoc(orderDocRef, orderData, { merge: true });
    console.log('[Firestore] Order saved successfully to cloud:', order.id);
    return true;
  } catch (error) {
    console.error('[Firestore] Error saving order to Firestore:', error);
    return false;
  }
}

/**
 * Real-time listener for all orders in Firestore.
 * Updates the admin dashboard instantly whenever a customer places an order
 * from their phone or computer anywhere.
 */
export function subscribeToOrders(
  onOrdersUpdated: (orders: CODOrder[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: CODOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            customerName: data.customerName || '',
            phone: data.phone || '',
            city: data.city || '',
            address: data.address || '',
            bundle: data.bundle || {},
            totalMAD: data.totalMAD || 0,
            paymentMethod: data.paymentMethod || 'cod',
            notes: data.notes || '',
            createdAt: data.createdAt || new Date().toLocaleTimeString(),
            fullDate: data.fullDate || '',
            orderNumber: data.orderNumber || docSnap.id,
            status: data.status || 'pending',
          } as CODOrder);
        });

        // Sort orders newest first
        list.sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
          return numB - numA;
        });

        onOrdersUpdated(list);
      },
      (error) => {
        console.warn('[Firestore] Orders subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (e) {
    console.warn('[Firestore] Failed to initiate orders listener:', e);
    return () => {};
  }
}

/**
 * Updates order status (e.g. pending -> confirmed -> shipped) in Firestore.
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: CODOrder['status']
): Promise<boolean> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { status });
    return true;
  } catch (error) {
    console.error('[Firestore] Error updating order status:', error);
    return false;
  }
}

/**
 * Updates full order details in Firestore.
 */
export async function updateOrderInFirestore(order: CODOrder): Promise<boolean> {
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, order, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firestore] Error updating order:', error);
    return false;
  }
}

/**
 * Deletes an order from Firestore.
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (error) {
    console.error('[Firestore] Error deleting order:', error);
    return false;
  }
}

/**
 * Real-time listener for site configuration (theme, settings, bundles)
 */
export function subscribeToSiteConfig(
  onConfigUpdated: (config: Partial<SiteData>) => void
): () => void {
  try {
    const docRef = doc(db, 'site_data', 'config');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onConfigUpdated(docSnap.data() as Partial<SiteData>);
        }
      },
      (err) => {
        console.warn('[Firestore] Site config listener notice:', err);
      }
    );
  } catch (e) {
    return () => {};
  }
}

/**
 * Saves site config to Firestore.
 */
export async function saveSiteConfigToFirestore(data: Partial<SiteData>): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_data', 'config');
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (e) {
    console.warn('[Firestore] Error saving site config to Firestore:', e);
    return false;
  }
}
