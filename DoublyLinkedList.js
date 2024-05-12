// class Node {
//     constructor(data, next = null, prev = null) {
//         this.data = data;
//         this.next = next;
//         this.prev = prev;
//     }
// }

// export class DoublyLinkedList {
//     constructor() {
//         this.head = null;
//         this.tail = null;
//     }

//     insertAtBeginning(data) {
//         let newNode = new Node(data);
//         if (!this.head) {
//             this.head = this.tail = newNode;
//         } else {
//             newNode.next = this.head;
//             this.head.prev = newNode;
//             this.head = newNode;
//         }
//         return this.head;
//     }

//     // Get the next node
//     getNext(node) {
//         return node.next;
//     }
//     hasNext(node){
//         return node.next!=null;
//     }
//     // Get the previous node
//     getPrev(node) {
//         return node.prev;
//     }
//     hasPrev(node) {
//         return node.prev!=null;
//     }
//     // Save to localStorage
//     saveToLocalStorage() {
//         localStorage.setItem('DoublyLinkedList', JSON.stringify(this));
//     }

//     // Retrieve from localStorage
//     retrieveFromLocalStorage() {
//         let retrievedObject = localStorage.getItem('DoublyLinkedList');
//         if (retrievedObject) {
//             let list = JSON.parse(retrievedObject);
//             this.head = list.head;
//             this.tail = list.tail;
//         }
//     }

//     // Save to a backup file
//     saveToBackupFile() {
//         let fs = require('fs');
//         fs.writeFile('DoublyLinkedListBackup.txt', JSON.stringify(this), function(err) {
//             if (err) throw err;
//             console.log('Saved to backup file!');
//         });
//     }

//     // Retrieve from a backup file
//     retrieveFromBackupFile() {
//         let fs = require('fs');
//         fs.readFile('DoublyLinkedListBackup.txt', 'utf8', (err, data) => {
//             if (err) throw err;
//             let list = JSON.parse(data);
//             this.head = list.head;
//             this.tail = list.tail;
//             console.log('Retrieved from backup file!');
//         });
//     }
// }




class Node {
    constructor(data, next = null, prev = null) {
        this.data = data;
        this.next = next;
        // this.prev = prev;
    }
}

// import { DoublyLinkedList } from "./DoublyLinkedList";
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
    clear(){
        this.head = null;
        this.tail = null;
    }
    insertAtBeginning(data) {
        let newNode = new Node(data);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        return this.head;
    }
    getCurrent(){
        return this.head;
    }
    // Get the next node
    getNext() {
        this.head = this.head.next;
        return this.head;
    }
    hasNext(){
        return this.head.next!=null;
    }
    // Save to localStorage
    saveToLocalStorage() {
        var ll_str = JSON.stringify(this);
        console.log(ll_str);
        localStorage.setItem('DoublyLinkedList', ll_str);
    }

    // Retrieve from localStorage
    retrieveFromLocalStorage() {
        let retrievedObject = localStorage.getItem('DoublyLinkedList');
        if (retrievedObject) {
            let list = JSON.parse(retrievedObject);
            this.head = list.head;
            this.tail = list.tail;
            return true;
        }
    }

    // Save to a backup file
    getBackupFile() {
        if (this.head!=null) 
            return JSON.stringify(this);
        // let fs = require('fs');
        // fs.writeFile('DoublyLinkedListBackup.txt', JSON.stringify(this), function(err) {
        //     if (err) throw err;
        //     console.log('Saved to backup file!');
        // });
    }

    // Retrieve from a backup file
    retrieveFromBackupFile() {
        let fs = require('fs');
        fs.readFile('DoublyLinkedListBackup.txt', 'utf8', (err, data) => {
            if (err) throw err;
            let list = JSON.parse(data);
            this.head = list.head;
            this.tail = list.tail;
            console.log('Retrieved from backup file!');
        });
    }
}