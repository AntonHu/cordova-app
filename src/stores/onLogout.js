import sunCityStore from './sunCity';
import userStore from './user';
import miningStore from './mining';
import keyPair from './keyPair';
import stationStore from './station';

const onLogout = () => {
  sunCityStore.onLogout();
  userStore.onLogout();
  miningStore.onLogout();
  stationStore.onLogout();
  keyPair.onLogout();
};

export default onLogout;