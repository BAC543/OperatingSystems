module TSOS{
    export class Memory{
        constructor(
            public Mem = new Array(Segment_Length)
            ) {
        }//constructor

        public init(): void{
            //initialize all memory to be 0
            this.clearMem();
            //Inserts memory into the GUI
            //this.memoryInsert();

        }//init

        getMem(){
            return this.Mem;
        }//getMem

        clearMem(){
            for(var i = 0; Segment_Length > i; i++){
                this.Mem[i] = "00";// Everything begins at 00 in hex
            }//for
        }//clearMem

        
    }//Memory
}//TSOS