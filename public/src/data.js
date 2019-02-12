class Dao {
    constructor() {
        console.log('data is instancied')
    }

    getListRef(ref) {
        return new ListReference(this.getRef(ref))
    }

    getCardRef(ref) {
        return new BaseReference(this.getRef(ref))
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

    constructor(ref) {
        this.ref = ref;
        this.ref.on("value",
            value => this.callListener(value))
    }
    on(event, listener) {
        this.listener = listener;
        if (this.data) {
            this.listener(this.data);
        }
    }

    callListener(snap) {
        snap = this.treateDatas(snap)
        this.data = snap;
        if (this.listener) {
            this.listener(this.data);
        }
    }
}

class BaseReference extends Reference {

    treateDatas(data) {
        return data.val();
    }

}

class ListReference extends Reference {

    treateDatas(snap) {
        let data = snap.val();
        data = [...data.keys()];
        return data;
    }
}

export default new Dao()