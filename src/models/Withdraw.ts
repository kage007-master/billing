import { model, Schema } from "mongoose";

// export interface User {
//   address: string;
//   name?: string;
//   wallet: any;
//   balance: string;
//   avatarUrl?: string;
// }

const ModelSchema = new Schema({
  address: { type: String, required: true },
  name: { type: String, required: true },
  chain: { type: String, require: true },
  network: { type: String, require: true },
  amount: { type: Number, require: true },
  status: { type: Boolean, required: true },
  to: { type: String, required: true },
});

const Model = model("withdraw", ModelSchema);
export default Model;
