export interface ChartDataInfo {
  productId: string;
  productName: string;
  totalUser: number;
  totalPurchase: number;
  totalProduct: number;
  totalView: number;
  totalBuy: number;
  totalShipCod: number;
  labels: string[];
  datasets: DataSets[];
}

export interface DataSets {
  label: string;
  borderColor: string;
  data: DataSetsInfo[];
}

export interface DataSetsInfo {
  totalUser: number;
  totalPurchase: number;
  totalProduct: number;
  totalView: number;
  totalBuy: number;
  totalShipCod: number;
}
