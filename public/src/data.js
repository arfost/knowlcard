class Dao {
    constructor() {
        console.log('data is instancied')
    }

    getListRef(ref) {
        return new ListReference(this.getRef(ref))
    }

    getCardRef(ref) {
        console.log("ref path is ", ref)
        return new CardReference(this.getRef(ref))
    }

    getRef(path, params = {}) {
        let nodeRef;
        if (!path.includes('-new-')) {
            nodeRef = firebase.app().database().ref(path);
        } else {
            path = path.replace("-new-")
            nodeRef = firebase.app().database.ref(path).push()
        }

        for (let param in params) {
            nodeRef = nodeRef[param](params[param]);
        }
        return nodeRef;
    }
}

class FireReference {

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

    save(datas) {
        datas = this.presave(datas);
        this.ref.update(datas);
    }

    presave(datas) {
        return datas;
    }

    callListener(snap) {
        snap = this.treateDatas(snap)
        this.data = snap;
        if (this.listener) {
            this.listener(this.data);
        }
    }
}

class CardReference extends FireReference {

    treateDatas(data) {
        data = data.val();
        if (!(typeof data === "object")) {
            data = CardReference.newCardModel
        }
        return data;
    }

    static get newCardModel() {
        return {
            title: "Empty card",
            body: ["empty body"],
            keywords: []
        }
    }
}

class ListReference extends FireReference {

    treateDatas(snap) {
        let data = snap.val();
        data = [...data.keys()];
        return data;
    }

    presave() {
        throw new Error('save of card list is not authorised')
    }
}

export default new Dao()