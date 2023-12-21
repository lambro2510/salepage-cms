import { ComboDto } from "../interface";

export interface ComboDtoInterface extends ComboDto {
    active : boolean
}

export interface ProductInComboResponse {
    productId : string;
    productName : string;
    imageUrl : string | undefined;
    isInCombo : boolean
}