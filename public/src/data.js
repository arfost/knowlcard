class Dao {
    constructor() {
        console.log('data is instancied')
    }

    getListRef(ref) {
        console.log(ref)
        return this.getRef(ref)
    }

    getRef(path, params = {}) {
        let nodeRef = firebase.app().database().ref(path);
        for (let param in params) {
            nodeRef = nodeRef[param](params[param]);
        }
        return nodeRef;
    }
}

class Reference {

    constructor() {
        this.listener = [];
    }
    on(event, listener) {
        this.listener.push(listener);
    }
}

export default new Dao()