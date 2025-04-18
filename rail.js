const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  TOKEN_URL,
  WITHDRAWAL_URL,
  ACCOUNTS_URL
} = process.env;

const getAccessToken = async (scope = 'accounts:read') => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.response?.data || error.message);
    throw error;
  }
};

const getAccounts = async () => {
  const token = await getAccessToken();

  console.log('token=========', token)

  try {
    const response = await axios.get(ACCOUNTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-l2f-request-id': uuidv4()
      },
      params: {
        page: 0,
        page_size: 10,
        status: 'OPEN'
      }
    });

    console.log('📄 Lista de cuentas:', response.data);
  } catch (error) {
    console.error('❌ Error obteniendo cuentas:', error.response?.data || error.message);
  }
};

getAccounts();
