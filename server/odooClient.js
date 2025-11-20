import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  ODOO_URL,
  ODOO_DB,
  ODOO_UID,
  ODOO_PASS,
} = process.env;

// Validate required environment variables
function validateConfig() {
  const missing = [];
  if (!ODOO_URL) missing.push('ODOO_URL');
  if (!ODOO_DB) missing.push('ODOO_DB');
  if (!ODOO_UID) missing.push('ODOO_UID');
  if (!ODOO_PASS) missing.push('ODOO_PASS');
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing Odoo environment variables: ${missing.join(', ')}`);
    console.warn('   Odoo integration will not work. Please configure .env file.');
    return false;
  }
  return true;
}

const isConfigured = validateConfig();

export async function odooExecute(model, method, args = [], kwargs = {}) {
  // If Odoo is not configured, throw a friendly error
  if (!isConfigured) {
    throw new Error('Odoo is not configured. Please set ODOO_URL, ODOO_DB, ODOO_UID, and ODOO_PASS in .env file.');
  }

  try {
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
      timeout: 10000, // 10 second timeout
    });

    if (response.data.error) {
      const errorMsg = response.data.error.data?.message || response.data.error.message || 'Unknown Odoo error';
      throw new Error(`Odoo Error: ${errorMsg}`);
    }

    return response.data.result;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Odoo server. Please check ODOO_URL configuration.');
    }
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Odoo request timed out. Please try again.');
    }
    throw error;
  }
}