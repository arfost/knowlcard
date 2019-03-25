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

    getLoginRef() {
        return new LoginReference();
    }
}

class FireReference {

    get params() {
        return {}
    }

    initConnection() {
        this.data = {};
        if (this.connection) {
            for (let connection in this.connection) {
                this.connection[connection].off();
            }
        }
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
                this.data[source] = tmp;
                this.newDatas();
            })
        }
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
            if (datas[source]) {
                this.connection[source].set(datas[source])
            }
        }
    }

    newDatas() {
        if (!this.ready) {
            return;
        }
        let deepCopiedData = JSON.parse(JSON.stringify(this.data))
        this.formattedData = this.treateDatas(...Object.values(deepCopiedData), this.base);
        if (this.listener) {
            this.listener(this.formattedData);
        }
    }

    getDefaultValue() {
        let deepCopiedData = JSON.parse(JSON.stringify(this.defaultValues))
        return this.treateDatas(...Object.values(deepCopiedData), this.base);
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
            },
            addComment: (poster, comment) => {
                this.data.comments = this.data.comments ? [...this.data.comments, {
                    poster,
                    comment
                }] : [{
                    poster,
                    comment
                }];
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
                hasDependendy: !!dependancies
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
        firebase.auth().onAuthStateChanged((user) => {
            console.log("state changed : ", user)
            if (user) {
                // User is signed in.
                this.uid = user.uid;

                this.initConnection();
                this.actions.setUser({
                    email: user.email,
                    displayName: user.displayName,
                    isAnonymous: user.isAnonymous,
                    photoURL: user.photoURL
                })
                // [START_EXCLUDE]
                // [END_EXCLUDE]
            } else {
                this.uid = "noConnection";
                this.initConnection();
                this.actions.emptyUser();
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
            },
            setUser: user => {
                this.data.user = user;
                this.save();
            },
            emptyUser: () => {
                if (this.data) {
                    this.data.user = this.defaultValues.user;
                    this.data.permission = [];
                }
            }
        }
    }

    get sources() {
        return {
            user: "users/" + this.uid,
            permissions: "permissions/" + this.uid
        }
    }

    treateDatas(user, permissions) {
        user = user ? user : this.defaultValues.user;
        user.permissions = permissions ? permissions : [];
        return user;
    }

    presave(user) {
        return {
            user
        }
    }

    get defaultValues() {
        return {
            user: {
                email: "anonymous@anonymous.com",
                displayName: "anonymous",
                isAnonymous: true,
                photoURL: "https://avatars0.githubusercontent.com/u/4815524?s=400&u=2c96e55bfde2464f97ee05ddcdb2abbb32a3fe97&v=4"
            }
        };
    }
}

export default new Dao();