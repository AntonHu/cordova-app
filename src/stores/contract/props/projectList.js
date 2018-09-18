import { observable, action, runInAction, computed } from 'mobx';
import { fetchProjectList } from "../request";

// 合约项目列表
class ProjectList {
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
    this.isLoading = true;
    const result = await fetchProjectList({ page });
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

export default ProjectList;
