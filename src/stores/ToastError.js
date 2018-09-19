import { Toast } from 'antd-mobile';

export const ToastError = (err) => {
  if (err.msg) {
    Toast.info(err.msg)
  }
};
