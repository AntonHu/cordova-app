import { observable, action, runInAction, computed } from 'mobx';
import { fetchComponentTrace } from "../request";
import { Toast } from 'antd-mobile'
import { ToastError } from "../../ToastError";

// 组件溯源详情
class ComponentTrace {
  @observable detail = {};

  @action
  reset = () => {
    this.detail = {};
  };

  @action
  getComponentTrace = async ({ moduleId }) => {
    try {
      const result = await fetchComponentTrace({ moduleId });
      runInAction(() => {
        if (result.success) {
          this.detail = result.data || {};
        } else {
          throw result;
        }
      });
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  }
}

export default ComponentTrace;
