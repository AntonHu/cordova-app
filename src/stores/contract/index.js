import { observable, action, runInAction, computed } from 'mobx';
import { ProjectList, MyProjectList, NotInvolvedDetail, InvolvedDetail, ComponentTrace, Appeal } from "./props";


class ContractStore {
  constructor() {
    // 合约项目列表
    this.projectList = new ProjectList();

    // 我参与的合约项目列表
    this.myProjectList = new MyProjectList();

    // 未参与的合约项目详情（包含申购）
    this.notInvolvedDetail = new NotInvolvedDetail();

    // 已参与的合约项目详情
    this.involvedDetail = new InvolvedDetail();

    // 组件溯源详情
    this.componentTrace = new ComponentTrace();

    // 申诉
    this.appeal = new Appeal();
  }

  resetStore = () => {
    this.projectList.reset();
    this.myProjectList.reset();
    this.notInvolvedDetail.reset();
    this.involvedDetail.reset();
    this.componentTrace.reset();
    this.appeal.reset();
  };

  onLogout = () => {
    this.resetStore();
  }
}

const contractStore = new ContractStore();
export default contractStore;
