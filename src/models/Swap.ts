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
  from: { type: String, require: true },
  amount1: { type: Number, require: true },
  to: { type: String, require: true },
  amount2: { type: Number, require: true },
});

const Model = model("swap", ModelSchema);
export default Model;
