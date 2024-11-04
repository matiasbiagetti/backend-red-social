import axios from 'axios';

class AdService {
  async getAds(): Promise<any> {
    const response = await axios.get('https://api.example.com/ads');
    return response.data;
  }
}

export default new AdService();
