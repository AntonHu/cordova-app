import {Toast} from 'antd-mobile';

const ToastNoMask = (content) => {
  Toast.info(content, 3, null, false)
};

export default ToastNoMask;
