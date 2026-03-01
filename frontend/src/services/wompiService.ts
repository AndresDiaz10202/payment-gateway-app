import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getPublicConfig() {
  const response = await axios.get(`${API_URL}/api/config/public-key`);
  return response.data;
}

export async function getAcceptanceToken(sandboxUrl: string, publicKey: string) {
  const response = await axios.get(`${sandboxUrl}/merchants/${publicKey}`);
  return response.data.data.presigned_acceptance.acceptance_token;
}

export async function tokenizeCard(
  sandboxUrl: string,
  publicKey: string,
  cardData: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  },
) {
  const response = await axios.post(
    `${sandboxUrl}/tokens/cards`,
    cardData,
    {
      headers: {
        Authorization: `Bearer ${publicKey}`,
      },
    },
  );
  return response.data.data.id;
}