var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        } //constructor
        init() {
        } //init
        //loads the user's program into memory
        loadIn(newCode) {
            //clears memory every time you load so none of the last program lingers in memory
            _Mem.clearMem();
            for (var i in newCode) {
                _Mem.Mem[i] = newCode[i];
            } //for
        } //load in
        //Returns the hex at the specified address
        read(address) {
            return _Mem.Mem[address];
        } //read
        write(address, value) {
            _Mem.Mem[address] = value;
        } //write
        store() {
        }
    } //MemoryAccessor
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=memoryAccessor.js.map