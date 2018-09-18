import sunCityStore from './sunCity';
import userStore from './user';
import miningStore from './mining';
import keyPair from './keyPair';
import stationStore from './station';
import bankCardStore from './bankCard';
import contractStore from './contract';

const onLogout = () => {
  sunCityStore.onLogout();
  userStore.onLogout();
  miningStore.onLogout();
  stationStore.onLogout();
  keyPair.onLogout();
  bankCardStore.onLogout();
  contractStore.onLogout();
};

export default onLogout;