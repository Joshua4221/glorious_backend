import axios from 'axios';
import { configs } from '../config/index.js';

const { FLUTTER_WAVE_BASE_URL } = configs;

export class FlutterWave {
  async createSubaccount(data) {
    try {
      const response = await axios.post(
        `${FLUTTER_WAVE_BASE_URL}subaccounts`,
        data,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async createVirtualAccount(data) {
    try {
      const response = await axios.post(
        `${FLUTTER_WAVE_BASE_URL}virtual-account-numbers`,
        data,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async getAVirtualAccount(data) {
    try {
      const response = await axios.post(
        `${FLUTTER_WAVE_BASE_URL}virtual-account-numbers/${data?.accountNumber}`,
        data,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      return response?.data;
    } catch (error) {
      throw error;
    }
  }
}
