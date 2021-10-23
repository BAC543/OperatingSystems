/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, IR = "", isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        start(pcb) {
            _CPU.PC = parseInt(pcb.ProgramCounter);
            _CPU.Xreg = parseInt(pcb.Xreg, 16);
            _CPU.Yreg = parseInt(pcb.Yreg, 16);
            TSOS.Control.update_CPU_GUI();
        } //start
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                //Make we don't go past 255 (FF) instead of 256
                //  Didn't do this before and I ran into an infinite loop when I branched on FF
                while (_Mem.Mem.length - 1 > this.PC) {
                    this.fetchOpCode(_Mem.Mem[this.PC]);
                } //for
                //updates the PCB
                //  bool tell us not to create a new PCB in the GUI
                TSOS.Control.update_PCB_GUI(_PCBs[_PIDNumber], false);
                //Ends the program
                _CPU.isExecuting = false;
            } //if
        } //cycle
        //finds the Op Code associated with the hex nnumbers
        fetchOpCode(hex) {
            switch (hex) {
                case "A9":
                    this.IR = "A9";
                    this.loadConstant();
                    break;
                case "AD":
                    this.IR = "AD";
                    this.loadMemory();
                    break;
                case "8D":
                    this.IR = "8D";
                    this.store();
                    break;
                case "6D":
                    this.IR = "6D";
                    this.addCarry();
                    break;
                case "A2":
                    this.IR = "A2";
                    this.XregCon();
                    break;
                case "AE":
                    this.IR = "AE";
                    this.XregMem();
                    break;
                case "A0":
                    this.IR = "A0";
                    this.YregCon();
                    break;
                case "AC":
                    this.IR = "AC";
                    this.YregMem();
                    break;
                case "EA":
                    this.IR = "EA";
                    this.NoOperation();
                    break;
                case "00":
                    this.IR = "00";
                    this.programBreak();
                    break;
                case "EC":
                    this.IR = "EC";
                    this.compare();
                    break;
                case "D0":
                    this.IR = "D0";
                    this.branch();
                    break;
                case "EE":
                    this.IR = "EE";
                    this.increment();
                    break;
                case "FF":
                    this.IR = "FF";
                    this.sysCall();
                    break;
                default:
                    //Increments the program counter through the rest of memory when there is no Opcode
                    this.PC++;
                    break;
            } //switch
            //Update everything on the GUI
            TSOS.Control.update_Mem_GUI();
            TSOS.Control.update_CPU_GUI();
        } //fetchOPCode
        //Always increment the program counter to match the index of the hexcode in the program
        //
        //NOTE TO SELF: parseInt(value, base)
        //             OUTPUTS: CONVERTED value from the specificied base
        //                      to a base of 10
        loadConstant() {
            //fetches the next index in Memory and sets it to the accumulator
            this.Acc = this.decodeBase(String(_MemAcc.read(this.PC + 1)), 16);
            this.PC += 2;
        } //loadConstabnt
        loadMemory() {
            //loads from the Specified Addresss in Memory
            //              Stores in the accumulator as a decimal because I think this is how Alan wants it 
            this.Acc = this.decodeBase(String(_MemAcc.read(this.valueHelper())), 16);
            //Program Counter
            this.PC += 3;
        } //loadMemory
        //There must be a better way to snatch the next hexcode and store it. 
        store() {
            _MemAcc.write(this.valueHelper(), this.Acc);
            this.PC += 3;
        } //store
        addCarry() {
            //adds the contents of the address into the accumulator
            this.Acc += this.decodeBase(String(_MemAcc.read(this.valueHelper())), 16);
            this.PC += 3;
        } //addCarry
        XregCon() {
            this.Xreg = this.decodeBase(String(_MemAcc.read(this.PC + 1)), 16);
            this.PC += 2;
        } //XregCon
        XregMem() {
            //converts the new Value to hex
            //this.Xreg =  _MemAcc.read(this.valueHelper());
            this.Xreg = this.decodeBase(String(_MemAcc.read(this.valueHelper())), 16);
            //Program Counter
            this.PC += 3;
        } //XregMem
        YregCon() {
            this.Yreg = this.decodeBase(String(_MemAcc.read(this.PC + 1)), 16);
            this.PC += 2;
        } //YregCon
        YregMem() {
            //converts the new Value to hex
            //this.Yreg = _MemAcc.read(this.valueHelper());
            //NEED THIS to be a STRING for when decode parses everything
            var num = this.decodeBase(String(_MemAcc.read(this.valueHelper())), 16);
            this.Yreg = num;
            //Program Counter
            this.PC += 3;
        } //YregMem
        NoOperation() {
            //Except increment the Program Counter
            this.PC++;
        } //No Operation
        programBreak() {
            this.isExecuting = false;
            this.PC++;
        } //programBreak
        compare() {
            //sets the Zero Flag to the appropriate state
            //Easier to Debug when everything is not in the if 
            var data = _MemAcc.read(this.valueHelper());
            if (this.Xreg == this.decodeBase(String(data), 16)) {
                this.Zflag = 1;
            } //if
            else {
                this.Zflag = 0;
            }
            //increase three on the program counter for: compare OP code and the address(which takes up 2 space) that is being 
            //  examined in memory
            this.PC += 3;
        } //compare
        branch() {
            if (this.Zflag == 0) { //branch when the Z flag is zero
                //Adds the next byte to the program counter//
                //##############################################################///
                //this.PC += this.decodeBase(String(_MemAcc.read(this.PC+1)),16) % 256;
                //this.PC = 10;
                ///##############################################################///
                //Everything I did before
                var currPlace = this.PC;
                //increases PC by x amount 
                //  Adding 1 so we "start" the branch from the byte value rather than the D0
                this.PC += parseInt(_MemAcc.read(this.PC + 1).toString(16), 16) + 1;
                if (this.PC <= 127) {
                    //Increment 
                    //this.PC += parseInt(_MemAcc.read(this.PC+1).toString(16),16);
                    //Increment the PC by the byte that is next to it
                }
                if (this.PC > 127) {
                    //
                    // this.PC += this.decodeBase(String(_MemAcc.read(this.PC+1)),16);
                    // this.PC = this.PC % 256;
                    //Invoke 2's complement to find where to branch to in memory
                    //Converts the place we are hopping to an array in binary;
                    //var locationDec = this.PC + this.decodeBase(_MemAcc.read(currPlace+1),16);
                    //var locationDec = _MemAcc.read()
                    var locationBinary = (this.PC.toString(2));
                    var twoCompResBin = "";
                    //Flips the digits in the array
                    for (var i = 0; i < locationBinary.length; i++) {
                        if (locationBinary[i] == "0")
                            twoCompResBin += '1';
                        if (locationBinary[i] == "1")
                            twoCompResBin += '0';
                    } //for
                    //Add one to the result
                    var twosComp = this.decodeBase(twoCompResBin, 2) + 1;
                    var actualLoaction = 255 - twosComp + 1;
                    //testing------------------------//
                    console.log(actualLoaction);
                    //------------------------------//
                    //Set the PC to the result in to hop to it in memory                                        
                    this.PC = actualLoaction;
                } // if 127
            } //if Z flag
            else { //No Branch 
                //Just increment as normal to go past the rest of Op Code and the address
                this.PC += 2;
            } //else
        } //branch
        increment() {
            //The value of the byte in front of the Increment OP Code is incremented 
            //      hence why the Program Counter is looking one place ahead
            //
            //We then fetch the value of the byte and add it by one! :)
            //
            // decode the hex to decimal from the location in memory
            var memValue = this.decodeBase(String(_MemAcc.read(this.valueHelper())), 16);
            //Not sure what we should increment to when the byte is at its max value
            if (memValue == 255) {
                memValue = 0; //For now I will set it to "01" so it "loops" around
            } //if
            //increment and convert to a hex string
            var incMemValue = (memValue + 1).toString(16);
            // Write the incremented value into memory
            _MemAcc.write(this.valueHelper(), incMemValue);
            this.PC += 3;
        } //increment
        //---------REMINDER-------
        /*
        /IMPLEMENT THE INTERPUT QUEUE!!!!!!!!
        /PLEASSSSEEEEEEE!!!!!!!!!!!!!!!!!!!!!
        */
        sysCall() {
            switch (this.Xreg) {
                //Call 1
                //print the int stored in the Y register
                case 1:
                    //Prints Value of Y Register in Hex
                    //_StdOut.advanceLine();
                    _StdOut.putText(this.Yreg.toString(16));
                    this.PC++;
                    break;
                //Call2
                //print the 00-terminated string stored at the address in the Y register
                //
                //Convert the ASCII to text and output on the Console
                case 2:
                    //Outputs to text
                    //Remebers where the PC left off before jumping somewhere else in memory
                    var currentPlace = this.PC;
                    //Hop to the index in mmemory that the Y reg is pointing to
                    this.PC = this.Yreg;
                    //Stops when you begin counting past memory or when you specify the printing to end 
                    while (_MemAcc.read(this.PC) != "00" && this.PC < 255) {
                        //Must be converted back into Hex for the IR to read the instruction correctly
                        //
                        //----Read in the PC as an decimal
                        this.IR = _MemAcc.read(this.PC);
                        //I know this is kind of a mess but here is the explaination:
                        //  For whatever resaon in parse int it cannot convert from string to String (idk why)
                        //  Therefore I wrapped the IR in the String method and from there I wrapped around parseInt
                        //  Finally I convert the actual Char Code once it is a number and turn it into the actual
                        //  ASCII text
                        var IRString = String(this.IR);
                        //var IRnumber = parseInt(IRString);
                        _StdOut.putText(String.fromCharCode(parseInt(IRString, 16)));
                        this.PC++;
                    } //while   
                    //hops to the next op code in memory
                    this.PC = currentPlace + 1;
                    break;
                //Increments the PC when it is neither 1 or 2
                default:
                    this.PC++;
                    break;
            } //switch
        } //sysCall
        valueHelper() {
            //Example:
            //  8D "01" "02"
            //  8D "40" "00"
            //    "00"+"40"
            //    "0040"
            //     parse
            //     64 - 1
            //     63 (index 63 in mem is index 64)
            //
            //Grabs the next 2 hex numbers in Memory
            var wholeHex = _MemAcc.read(this.PC + 2) + _MemAcc.read(this.PC + 1);
            return this.decodeBase(wholeHex, 16);
        } //valueHelper
        //This serves as a means of decoding the hexidecimal and binary to decimal
        //  baseDecimal MUST BE A STRING!!!!! 
        //  MAKE SURE EVERYTHING THAT IS CALLED IN IS A STRING OR ELSE IT WONT WORK
        decodeBase(baseDecimals, base) {
            //var baseDecimals = charBase.split('');
            var decimal = 0;
            //These variables are not nessasary but they make the code easier to disect
            var baseNumber;
            var basePlace;
            for (var index = 0; index < baseDecimals.length; index++) {
                //Starts from the begining of the hex/binary string and multiplies to the power of the base based off of the index
                //Do this inorder to convert the string to hex
                //Example:   "1040"                    "01"
                //  1 * 16^3 = 4096           0 * 16^1 = 0  
                //  0 * 16^2 = 0              1 * 16^0 = 1
                //  4 * 16^1 = 64            
                //  0 * 16^0 = 0
                // +                          +
                //-----------------           --------------                   
                //             4160                       1             
                //Originally had this all in one line but it is difficult to debug 
                //Therefore I separated it into separate lines
                baseNumber = parseInt(String(baseDecimals[index]), base);
                // Takes into account that is in zero based
                basePlace = baseDecimals.length - (index + 1); // EX: (16^ (4 - (index + 1)))
                decimal += baseNumber * (base ** basePlace);
            } //for
            //May consider:
            //Returning the index in the Memory array by
            //decrementing by one because it is 0 based
            return decimal;
        } //decode
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map