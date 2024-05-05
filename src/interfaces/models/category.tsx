import { CategoryType } from '../enum/CategoryType';

export interface Category {
  id: string;
  categoryName: string;
  categoryType: CategoryType;
  description: string;
  timeType: CategoryType;
  timeValue: number;
  productType: string;
}
