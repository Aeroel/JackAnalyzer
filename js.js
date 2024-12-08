class a {
    static b(fn) {
        this[fn]();
    }
    static hehe() {
        console.log("333");
        
    }
}

a.b("hehe");