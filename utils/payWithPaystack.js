import axios from 'axios';
import { configs } from '../config/index.js';

const { PAYSTACK_SECRET_KEY, PAYSTACK_API_URL } = configs;

export class Paystack {
  async initializedTransaction(data) {
    try {
      const response = await axios.post(
        `${PAYSTACK_API_URL}/transaction/initialize`,
        data,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async TotalAmountTransaction() {
    try {
      const response = await axios.get(
        `${PAYSTACK_API_URL}/transaction/totals`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async ListOfTransaction(page, limit) {
    try {
      const response = await axios.get(
        `${PAYSTACK_API_URL}/transaction?perPage=${limit}&page=${page}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async ListOfTransactionWithStatus(page, limit, status) {
    try {
      const response = await axios.get(
        `${PAYSTACK_API_URL}/transaction?perPage=${limit}&page=${page}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }
}
