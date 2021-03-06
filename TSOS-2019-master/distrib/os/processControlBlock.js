var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(PID = 0, PC = 0, ProcesState = "Resident", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, IR = "", segment = 0, isExecuting = false, offset = 0, //base & offset
        limit = Segment_Length - 1, //limit
        waitTime = 0, turnTime = 0, location = "", priority = 3) {
            this.PID = PID;
            this.PC = PC;
            this.ProcesState = ProcesState;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.segment = segment;
            this.isExecuting = isExecuting;
            this.offset = offset;
            this.limit = limit;
            this.waitTime = waitTime;
            this.turnTime = turnTime;
            this.location = location;
            this.priority = priority;
        } //constructor
        init() {
            this.PID = 0;
            this.PC = 0;
            this.ProcesState = "Resident";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = "";
            this.segment = -1;
            this.isExecuting = false;
            this.offset = 0;
            this.limit = this.offset + Segment_Length - 1;
            this.waitTime = 0;
            this.turnTime = 0;
        } //init
        getPID() {
            return this.PID;
        } //getPID
        setPID(newPID) {
            this.PID = newPID;
        } //setPID
    } //Process Control Block
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=processControlBlock.js.map