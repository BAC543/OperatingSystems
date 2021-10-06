module TSOS{
    export class MemoryAccessor{
        constructor(

            ) {
        }//constructor

        public init(): void{

        }//init

         //loads the user's program into memory
         loadIn(newCode){
             //clears memory every time you load so none of the last program lingers in memory
             _Mem.clearMem();
            for(var i in newCode){
                _Mem.Mem[i] = newCode[i];
            }//for
        }//load in

        //Returns the hex at the specified address
        read(address){
            //The Memory is a string so I convert to a number
            var hex: number = parseInt(_Mem.Mem[address]);
            return hex;
        }//read

        write(address, value){
            _Mem.Mem[address] = value;
        }//write

        store(){
            
        }
        
    }//MemoryAccessor
}//TSOS