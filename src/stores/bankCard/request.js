import { errorWrap, get, post } from "../../utils/fetch";
import { backendServer } from "../../utils/variable";

const serverUrl = backendServer + '/app';

/**
 * 最近使用银行卡
 * @returns {Promise<*>}
 */
export const fetchLatestBankCard = async () => {
  try {
    const response = await get(`${serverUrl}/bankCard/latest`);
    return response;
  } catch (err) {
    return errorWrap(err, '最近使用银行卡');
  }
};

/**
 * 最近使用银行卡
 * @returns {Promise<*>}
 */
export const fetchBindBankCard = async ({ bank, name, bankCardNumber }) => {
  try {
    const response = await post(`${serverUrl}/bankCard/bind`, { bank, name, bankCardNumber });
    return response;
  } catch (err) {
    return errorWrap(err, '绑定银行卡');
  }
};

