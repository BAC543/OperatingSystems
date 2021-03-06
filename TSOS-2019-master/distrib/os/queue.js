/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    class Queue {
        constructor(q = new Array()) {
            this.q = q;
        }
        getSize() {
            return this.q.length;
        }
        isEmpty() {
            return (this.q.length == 0);
        }
        enqueue(element) {
            this.q.push(element);
        }
        priorityEnqueue(pcb) {
            // creating object from queue element
            var contain = false;
            // iterating through the entire
            // item array to add element at the
            // correct location of the Queue
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].priority > pcb.priority) {
                    // Once the correct location is found it is
                    // enqueued
                    this.q.splice(i, 0, pcb);
                    contain = true;
                    break;
                }
            }
            // if the element have the highest priority
            // it is added at the end of the queue
            if (!contain) {
                this.q.push(pcb);
            }
        } //enqueue
        // front function
        front() {
            // returns the highest priority element
            // in the Priority queue without removing it.
            if (this.isEmpty())
                return "No elements in Queue";
            return this.q[0];
        } //front
        rear() {
            // returns the lowest priority
            // element of the queue
            if (this.isEmpty())
                return "No elements in Queue";
            return this.q[this.q.length - 1];
        } //rear
        dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }
        toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
    }
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=queue.js.map