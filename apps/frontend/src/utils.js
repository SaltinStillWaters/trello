import constant from '../src/constant';

class Utils {
    constructor() {
        if (!Utils.instance) {
          Utils.instance = this;
        }
        return Utils.instance;
    }
    getToken() {
        return '?token='+localStorage.getItem('token');
    }
    _api(method) {
        return constant.apiv1 + method;
    }
}

const instance = new Utils();
Object.freeze(instance);
export default instance;