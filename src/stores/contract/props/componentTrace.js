import { observable, action, runInAction, computed } from 'mobx';
import { fetchComponentTrace } from "../request";

// 组件溯源详情
class ComponentTrace {
  @observable detail = {};

  @action
  reset = () => {
    this.detail = {};
  };

  @action
  getComponentTrace = async ({ moduleId }) => {
    const result = await fetchComponentTrace({ moduleId });
    if (result.success) {
      this.detail = result.data || {};
    } else {

    }
  }
}

export default ComponentTrace;
