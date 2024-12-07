class A {
    funchehe() {
        if (this.somethingBad()) {
            this.generic_error();
        }
    }

    generic_error() {
        const stack = new Error().stack.split('\n');
        // The caller function is usually on the third line of the stack trace
        const callerLine = stack[2]; 
        const callerNameMatch = callerLine.match(/at (\w+\.\w+|\w+|\<anonymous\>)/); // Match function names
        
        // If a match is found, use it; otherwise, default to 'Unknown'
        const callerName = callerNameMatch ? callerNameMatch[1] : 'Unknown';
        
        throw new Error(`Error called from: ${callerName}`);
    }

    somethingBad() {
        return true; // Simulating a bad condition
    }
}

const instance = new A();
try {
    instance.funchehe();
} catch (error) {
    console.log(error.message); // Should log: Error called from: funchehe
}