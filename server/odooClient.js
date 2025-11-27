import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  ODOO_URL,
  ODOO_DB,
  ODOO_UID,
  ODOO_PASS,
} = process.env;

export async function odooExecute(model, method, args = [], kwargs = {}) {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        ODOO_DB,
        parseInt(ODOO_UID, 10),
        ODOO_PASS,
        model,
        method,
        args,
        kwargs,
      ],
    },
    id: Date.now(),
  };

  const response = await axios.post(`${ODOO_URL}/jsonrpc`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  if (response.data.error) {
    throw new Error(JSON.stringify(response.data.error));
  }

  return response.data.result;
}