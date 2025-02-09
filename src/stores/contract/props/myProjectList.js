import {observable, action, runInAction, computed} from 'mobx';
import { fetchProjectList, fetchUserProjectList } from "../request";
import { Toast } from 'antd-mobile';
import { ToastError } from "../../ToastError";

// 我参与的合约项目列表
class MyProjectList {
  @observable page = 1;
  @observable list = [];
  @observable isLoading = false;
  @observable hasMore = true;

  @action
  reset = () => {
    this.page = 1;
    this.list = [];
    this.isLoading = false;
    this.hasMore = true;
  };

  @action
  loadList = async (page) => {
    try {
      this.isLoading = true;
      const result = await fetchUserProjectList({ page });
      runInAction(() => {
        this.isLoading = false;
        if (result.success) {
          const data = result.data || {};
          const list = data.list || [];

          if (list.length < 1) {
            this.hasMore = false;
          }

          if (page === 1) {
            this.list = list;
          } else {
            this.list = this.list.concat(list)
          }

        } else {
          throw result
        }
      });
      return result;
    } catch (e) {
      this.isLoading = false;
      ToastError(e);
      return e;
    }

  };

  @action
  loadMore = async () => {
    if (this.isLoading || !this.hasMore) {
      return;
    }
    this.page += 1;
    this.loadList(this.page);
  };

  @action
  initLoad = async () => {
    if (this.isLoading) {
      return;
    }
    this.page = 1;
    this.hasMore = true;
    this.loadList(this.page)
  };


}

export default MyProjectList;
