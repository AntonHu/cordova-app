import { get, post } from '../../utils/fetch';
import { backendServer } from '../../utils/variable';

/**
 * 订单列表
 */
export const fetchOrderList = async params => {
  const response = await get(`${backendServer}/erp/getSalesOrders`, params);
  return response.data || [];
};
