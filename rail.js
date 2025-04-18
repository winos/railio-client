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
    console.error('Error obteniendo token:', error.response?.data || error.message);
    throw error;
  }
};


const APPLICATION_URL = process.env.APPLICATION_URL;

// 🧾 Crear una nueva aplicación
const createApplication = async () => {
  const token = await getAccessToken('applications:write');

  const payload = {
    application_type: 'INDIVIDUAL',
    terms_and_conditions_accepted: true,
    customer_id: 'customer_123456',
    account: {
      account_reference: 'ref-123',
      currency: 'USD',
      product_type: 'DEPOSIT'
    },
    individual: {
      first_name: 'Juan',
      last_name: 'Pérez',
      date_of_birth: '1990-05-15',
      address: {
        line1: '123 Calle Principal',
        city: 'Ciudad Ejemplo',
        state: 'Antioquia',
        country: 'CO',
        postal_code: '050001'
      },
      email: 'juan.perez@example.com',
      phone: '+573001112233'
    }
  };

  try {
    const response = await axios.post(APPLICATION_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-l2f-request-id': uuidv4(),
        'x-l2f-idempotency-id': uuidv4()
      }
    });

    console.log('Aplicación creada:', response.data);
  } catch (error) {
    console.error('Error creando aplicación:', error.response?.data || error.message);
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

    console.log('Lista de cuentas:', response.data);
  } catch (error) {
    console.error('Error obteniendo cuentas:', error.response?.data || error.message);
  }
};

getAccounts();

createApplication();

