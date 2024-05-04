import { StoreStatus } from '../enum/StoreStatus';

export interface Store {
  storeId: string;
  storeName: string;
  address: string;
  description: string;
  status: StoreStatus;
  imageUrl: string;
}
