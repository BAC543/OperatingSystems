/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "TSOS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "0.07";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

const SOFTWARE_IRQ: number = 2; // SoftwareInterupt for context switching



//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

//Memory Constants
const Segment_Length: number = 256;
var _Mem: TSOS.Memory;
//Detects if there are programs in the MM
var _RunningPrograms = new  Array(3);

//Memory Accessor
//var _MemAcc: TSOS.MemoryAccessor;
var _MemAcc: any = null;
var _MemoryManager: any = null;

//Context Switching
var _Scheduler: any = null;   //Had to init in control.ts. It wasn't reconizing the object when I defined it here
var _readyQueue: any = null;  // <-- Same for the Queue
var _Dispatcher: any = null;
var _QuantumDefault: number = 6;
var _switched: boolean = false;  //Tells log when there was a context switch
var _Algorithms = ["rr", "fcfs", "priority"];
var _Algorithm = _Algorithms[0]; // Set to Round Robin


//Program Control Block
//PCBs init in control
var _RunningPCB: any = null; //TSOS.ProcessControlBlock;
var _PIDNumber: number = 0;
var _PCBs = new Array(Segment_Length); //basically my resident Queue
var _PCBsPriorityQueue: TSOS.Queue = null;
var _PStates = ["Resident", "Ready", "Running", "Terminated"];

//var _PCBs = new TSOS.Queue;
var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;          // Initialized in Control.hostInit().
var _DrawingContext: any;                // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;       // Additional space added to font size when advancing a line.

var _Trace: boolean = true;              // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue: TSOS.Queue = null;
var _KernelInputQueue: TSOS.Queue = null; 
var _KernelBuffers = null; 

// Standard input and output
var _StdIn:  TSOS.Console = null; 
var _StdOut: TSOS.Console = null;

//Files
var _FileID: number = 0; 
var _Files : any = null; // File Queue inited in console.ts

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;
var _Counter: Number = 0;//added to play around with for scrolling

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

//Disk
var _Disk: TSOS.Disk = null;
var _Swapper: TSOS.Swapper = null;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: TSOS.DeviceDriverKeyboard  = null;
var _krnDiskDriver: TSOS.DeviceDriverDisk = null;    //init on krn bootstrap

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
