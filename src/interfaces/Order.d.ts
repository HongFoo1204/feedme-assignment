type OrderType = "Normal" | "VIP";
type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED";

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  item?: []; //To be add
}
