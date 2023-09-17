import { Order } from "./Order";

type BotStatus = "IDLE" | "BUSY";

export interface Bot {
  id: string;
  status: BotStatus;
  order?: Order;
}
