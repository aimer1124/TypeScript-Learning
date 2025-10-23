let i: number = 5;
i = i + 10;
// console.log(i);

// Function to add two numbers
function add(a: number, b: number): number {
    return a + b;
}

// console.log(add(3, 7));

// Function to void example
function logMessage(message: string | number): void {
    console.log(message);
}

// logMessage("Hello, TypeScript!");
// logMessage(42);

// Interface example
interface Person {
    name: string;
    age: number;
    address?: string; // Optional property
}

const person: Person = {
    name: "Alice",
    age: 30
};

// console.log(person);

// Interface with function  
interface MathOperation {
    (x: number, y: number): number;
}

const multiply: MathOperation = (x: number, y: number): number => x * y;
const addTwo: MathOperation = (x: number, y: number): number => x + y;

// console.log(addTwo(5, 10));
// console.log(multiply(4, 6));


// Class example
class Person {
    id: number;
    name: string;
    age: number;

    constructor(id: number, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

const brad = new Person(1, "Brad Traversy", 36);
const john = new Person(2, "John Doe", 30);

// console.log(brad);
// console.log(john);


// Class implements Interface example
interface PersonInterface {
    name: string;
    age: number;
    register(): string;
}

class Employee implements PersonInterface {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    register() {
        return `${this.name} is now registered.`;
    }
}

const emp = new Employee("Jane Smith", 28);
// console.log(emp.register());



// Class extends another Class example
class Boy extends Person {
    position: string;

    constructor(id: number, name: string, age: number, position: string) {
        super(id, name, age);
        this.position = position;
    }
}
const boy1 = new Boy(3, "Mike", 25, "Forward");
// console.log(boy1);



// Generics example
// Generic function without type parameter
function getGenericsArray(items: any[]): any[] {
    return new Array().concat(items);
}

const numGenericsArray = getGenericsArray([1, 2, 3, 4]);
const strGenericsArray = getGenericsArray(["Alice", "Bob", "Charlie"]);

numGenericsArray.push(5);
strGenericsArray.push("Dave");

numGenericsArray.push("Hello"); // No Error
strGenericsArray.push(10); // No Error


// Generic function with type parameter
function getArray<T>(items: T[]): T[] {
    return new Array().concat(items);
}

const numArray = getArray<number>([1, 2, 3, 4]);
const strArray = getArray<string>(["Alice", "Bob", "Charlie"]);

numArray.push(5);
strArray.push("Dave");

numArray.push("Hello"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
strArray.push(10); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.




