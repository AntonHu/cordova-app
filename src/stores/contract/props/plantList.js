import { action, computed, observable, runInAction, toJS } from 'mobx';
import {
  fetchPlantList
} from "../request";
import { ToastError } from "../../ToastError";

class PlantList {
  @observable page = 1;
  @observable list = [];
  @observable isLoading = false;

  @action
  reset = () => {
    this.page = 1;
    this.list = [];
    this.isLoading = false;
  };

  @action
  loadList = async () => {
    try {
      this.isLoading = true;
      const result = await fetchPlantList();
      runInAction(() => {
        this.isLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.list = data.plantList || []
        } else {
          throw result;
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
  initLoad = async () => {
    if (this.isLoading) {
      return;
    }
    this.page = 1;
    this.isLoading = false;
    this.loadList(this.page)
  };
}

export default PlantList;
