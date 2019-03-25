class Dao {
    constructor() {
        console.log("data is instancied");
    }

    getListRef() {
        return new ListReference();
    }

    getCardRef(id, base) {
        return new CardReference(id, base);
    }
}

class FireReference {

    get params() {
        return {}
    }

    initConnection() {
        console.log('instance', this.id)
        this.data = {};
        let connection = {};
        if (this.base) {
            connection.base = this.initSource(this.sources.base, this.params.base);
        }
        for (let source in this.sources) {
            if (source === "base") {
                continue;
            }
            this.data[source] = this.defaultValues[source];
            connection[source] = this.initSource(this.sources[source], this.params[source]);
            connection[source].on('value', snap => {
                let tmp = snap.val();
                console.log("bug incoming ? ", this.id, tmp, source, this.data);
                this.data[source] = tmp;
                this.newDatas();
            })
        }
        console.log("data pret", this.id, this.data)
        this.connection = connection;
        this.ready = true;;
        this.newDatas();
    }

    on(event, listener) {
        this.listener = listener;
        if (this.formattedData) {
            this.listener(this.formattedData);
        }
    }

    initSource(path, params = []) {
        let nodeRef;
        if (!path.includes("--new--")) {
            nodeRef = firebase
                .app()
                .database()
                .ref(path);
        } else {
            path = path.replace("--new--", "");
            nodeRef = firebase
                .app()
                .database()
                .ref(path)
                .push();
            this.id = nodeRef.key;
        }

        for (let param in params) {
            nodeRef = nodeRef[param](params[param]);
        }
        return nodeRef;
    }



    save() {
        let datas = this.presave(...Object.values(this.data), this.base);
        for (let source in this.connection) {
            console.log("saving ", source, datas[source])
            if (datas[source]) {
                this.connection[source].set(datas[source])
            }
        }
    }

    newDatas() {
        if (!this.ready) {
            return;
        }
        this.formattedData = this.treateDatas(...Object.values(this.data), this.base);
        if (this.listener) {
            this.listener(this.formattedData);
        }
    }
}

class CardReference extends FireReference {
    constructor(id, base) {
        super();
        this.id = id;
        this.base = base;
        this.initConnection();
    }



    get sources() {
        return {
            dependancies: "features/dependancies/" + this.id,
            comments: "features/comments/" + this.id,
            desc: "features/desc/" + this.id,
            votes: "features/votes/" + this.id,
            base: "features/base/" + this.id
        };
    }

    get actions() {
        return {
            save: values => {
                if (values.name) {
                    this.base.name = values.name;
                }
                if (values.desc) {
                    this.data.desc = values.desc;
                }
                if (values.dependancies) {
                    this.data.dependancies = values.dependancies;
                }
                this.save();
            }
        }
    }

    treateDatas(dependancies, comments, desc, votes, base) {
        let data = {
            name: base.name,
            dependancies: dependancies ?
                dependancies : this.defaultValues.dependancies,
            comments: comments ?
                comments : this.defaultValues.comments,
            desc: desc ? desc : this.defaultValues.desc,
            votes: votes ? votes : this.defaultValues.votes
        };
        return data;
    }

    presave(dependancies, comments, desc, votes, base) {
        let data = {
            base: {
                name: base.name,
                hasDependendy: !!dependancies.length
            },
            dependancies: dependancies ?
                dependancies : this.defaultValues.dependancies,
            comments: comments ?
                comments : this.defaultValues.comments,
            desc: desc ? desc : this.defaultValues.desc,
            votes: votes ? votes : this.defaultValues.votes
        };
        return data;
    }

    get defaultValues() {
        return {
            dependancies: [],
            comments: [],
            desc: ["new card"],
            votes: []
        };
    }
}

class ListReference extends FireReference {

    constructor() {
        super();
        this.initConnection();
    }

    get sources() {
        return {
            list: "features/base/"
        }
    }

    treateDatas(list) {
        console.log("data", list)
        let formattedData = []
        for (let featureId in list) {
            formattedData.push({
                id: featureId,
                base: list[featureId]
            })
        }
        return formattedData;
    }

    presave(list) {
        throw new Error("no list save")
    }

    get params() {
        return {
            list: []
        }
    }

    get defaultValues() {
        return {
            list: []
        };
    }
}

class LoginReference extends FireReference {

    constructor() {
        super();
        firebase.auth().getRedirectResult().then((result) => {
            if (!result || !result.credential) {
                return
            }
            this.token = result.credential.accessToken;
            this.email = result.user.email;
            this.uid = result.user.uid;
            this.initConnection();
        }).catch((error) => {
            console.log("auth error ", error)
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                this.email = user.email;
                this.uid = user.uid;
                // [START_EXCLUDE]
                // [END_EXCLUDE]
            } else {
                this.user = undefined;
                this.email = undefined;
                this.uid = undefined;
            }
        });
    }

    get actions() {
        return {
            toggleLogin: () => {
                if (!firebase.auth().currentUser) {
                    // [START createprovider]
                    var provider = new firebase.auth.GoogleAuthProvider();
                    // [END createprovider]
                    // [START addscopes]
                    provider.addScope('https://www.googleapis.com/auth/plus.login');
                    // [END addscopes]
                    // [START signin]
                    firebase.auth().signInWithRedirect(provider);
                    // [END signin]
                } else {
                    // [START signout]
                    firebase.auth().signOut();
                    // [END signout]
                }
            }
        }
    }

    get sources() {
        return {
            user: "users/" + this.uid
        }
    }

    treateDatas(list) {
        console.log("data", list)
        let formattedData = []
        for (let featureId in list) {
            formattedData.push({
                id: featureId,
                base: list[featureId]
            })
        }
        return formattedData;
    }

    presave(list) {
        throw new Error("no list save")
    }

    get params() {
        return {
            list: []
        }
    }

    get defaultValues() {
        return {
            list: []
        };
    }
}

export default new Dao();