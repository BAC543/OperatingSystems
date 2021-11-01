module TSOS{
    export class ProcessControlBlock{
        constructor(
            public PID: number = 0,
            public PC: number = 0,
            public ProcesState = "Resident",
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public IR: String = "",
            public segment: number = 0,
            public isExecuting: boolean = false,
            public offset: number = 0,
          ) {
        }//constructor

        public init(): void{
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
        }//init

        public getPID(){
            return this.PID;
        }//getPID
        
        public setPID(newPID){
            this.PID = newPID;
        }//setPID
        
    }//Process Control Block
}//TSOS