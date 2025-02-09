import { observable, action, runInAction, computed } from 'mobx';
import {
  ProjectList,
  MyProjectList,
  NotInvolvedDetail,
  InvolvedDetail,
  ComponentTrace,
  Appeal,
  ProjectDetail,
  TransferDetail,
  PlantList,
  TransferHistoryList,
  TransferList
} from "./props";


class ContractStore {
  constructor() {
    // 合约项目列表
    this.projectList = new ProjectList();

    // 我参与的合约项目列表
    this.myProjectList = new MyProjectList();

    // 未参与的合约项目详情（包含项目详情、申购相关动作）
    this.notInvolvedDetail = new NotInvolvedDetail(new ProjectDetail());

    // 已参与的合约项目详情（包含项目详情、申购信息、项目成团、电站建设）
    this.involvedDetail = new InvolvedDetail(new ProjectDetail());

    // 转让的项目详情（包含项目详情、转让信息）
    this.transferDetail = new TransferDetail(new ProjectDetail());

    // 组件溯源详情
    this.componentTrace = new ComponentTrace();

    // 申诉
    this.appeal = new Appeal();

    // 合约电站列表
    this.plantList = new PlantList();

    // 转让历史
    this.transferHistoryList = new TransferHistoryList();

    // 转让列表
    this.transferList = new TransferList();
  }

  resetStore = () => {
    this.projectList.reset();
    this.myProjectList.reset();
    this.notInvolvedDetail.reset();
    this.involvedDetail.reset();
    this.componentTrace.reset();
    this.appeal.reset();
    this.transferDetail.reset();
    this.plantList.reset();
    this.transferHistoryList.reset();
    this.transferList.reset();
  };

  onLogout = () => {
    this.resetStore();
  }
}

const contractStore = new ContractStore();
export default contractStore;
