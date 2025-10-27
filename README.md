# Learning TypeScript 

[TypeScript Crash Course](https://www.youtube.com/watch?v=BCg4U1FzODs)

## What is TypeScript?
TypeScript is a superset of JavaScript and an open-source programming language.

- Offers additional features to JavaScript, such as static typing, interfaces, and classes.
- Using types is completely optional in TypeScript.
- Compiles down to plain JavaScript that can run in any browser or JavaScript environment.
- Can be used for both front-end and back-end development.
- Types from 3rd party libraries can be added using DefinitelyTyped.

## Dynamic vs Static Typing

- Dynamic Typing(JavaScript, Python, Ruby, PHP): the types are associated with values at runtime and not names explicitly in your code.
- Static Typing(TypeScript, Java, C#, C++, Go): you explicitly declare types for variables, function parameters, and return values in your code. 

## Compiling TypeScript

- TypeScript code usees `.ts` and ``.tsx`` file extensions.
- `TSC` is the TypeScript compiler that converts TypeScript code into JavaScript code.
- To compile a TypeScript file, use the command: `tsc filename.ts`
- To watch for changes and automatically recompile, use: `tsc filename.ts --watch`
- To initialize a TypeScript project with a `tsconfig.json` file, use: `tsc --init`

## Install TypeScript

`pnpm install -g typescript`

```bash
jackson@192 TypeScript-Learning % pnpm install -g typescript

   ╭───────────────────────────────────────────────╮
   │                                               │
   │     Update available! 10.18.3 → 10.19.0.      │
   │     Changelog: https://pnpm.io/v/10.19.0      │
   │   To update, run: corepack use pnpm@10.19.0   │
   │                                               │
   ╰───────────────────────────────────────────────╯

Packages: +1
+
Progress: resolved 1, reused 0, downloaded 1, added 1, done

/Users/jackson/Library/pnpm/global/5:
+ typescript 5.9.3

Done in 2.6s using pnpm v10.18.3
```

## Check TypeScript Version
`tsc --version`
```bash
jackson@192 TypeScript-Learning % tsc -v        
Version 5.9.3
```

## Command TypeScript

- Execute TypeScript file: `tsc filename`
- Watch for changes: `tsc filename --watch`
- Initialize TypeScript project: `tsc --init`


## Types in TypeScript

- `boolean`: true or false values. `let isDone: boolean = false;`
- `number`: integer and floating-point numbers. `let decimal: number = 6;`
- `string`: text values. `let color: string = "blue";`
- `array`: collections of values of the same type. `let list: number[] = [1, 2, 3];`
- `tuple`: fixed-size collections of values of different types. `let x: [string, number] = ["hello", 10];`
- `enum`: a way to define a set of named constants. `let Color: enum {Red, Green, Blue};`
- `union`: a variable that can hold multiple types. `let value: string | number = "hello";`
- `any`: a type that can hold any value, effectively opting out of type checking. `let notSure: any = 4;`
- `void`: represents the absence of a value, typically used for functions that do not return anything. `function warnUser(): void { console.log("This is a warning message"); }`
- `null` and `undefined`: represent the absence of a value. `let u: undefined = undefined; let n: null = null;`
- `Object`: represents non-primitive types. `let obj: object = { name: "John", age: 30 };`

## Functions in TypeScript

```TypeScript
// Function to add two numbers
function add(a, b) {
    return a + b;
}
console.log(add(3, 7));
```

```bash
jackson@192 dist % node index
10
```

```TypeScript
// Function to void example
function logMessage(message: string | number): void {
    console.log(message);
}

logMessage("Hello, TypeScript!");
logMessage(42);
```

```bash
jackson@192 dist % node index
Hello, TypeScript!
42
```

## Interfaces in TypeScript

```TypeScript
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

console.log(person);
```

```bash
jackson@192 dist % node index
{ name: 'Alice', age: 30 }
```

```TypeScript
// Interface with function  
interface MathOperation {
    (x: number, y: number): number;
}

const multiply: MathOperation = (x: number, y: number): number => x * y;
const addTwo: MathOperation = (x: number, y: number): number => x + y;

console.log(addTwo(5, 10));
console.log(multiply(4, 6));
```

```bash
jackson@192 dist % node index
15
24
``` 

## Classes in TypeScript

### Class Basics
```TypeScript
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

console.log(brad);
console.log(john);
```

```bash
jackson@192 dist % node index
Person { id: 1, name: 'Brad Traversy', age: 36 }
Person { id: 2, name: 'John Doe', age: 30 }
```

`private`: Accessible only within the class.
`protected`: Accessible within the class and its subclasses.
`public`: Accessible from anywhere.

### Class Implements Interface
```TypeScript
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
console.log(emp.register());
```

```bash
jackson@192 dist % node index
Jane Smith is now registered.
```

### Class extends Another Class
```TypeScript
// Base Class example
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

// Class extends another Class example
class Boy extends Person {
    position: string;

    constructor(id: number, name: string, age: number, position: string) {
        super(id, name, age);
        this.position = position;
    }
}
const boy1 = new Boy(3, "Mike", 25, "Forward");
console.log(boy1);
```

```bash
jackson@192 dist % node index
Boy { id: 3, name: 'Mike', age: 25, position: 'Forward' }
```

## Generics in TypeScript

```TypeScript
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
```

## React with TypeScript

### Create React App with TypeScript Template

`npx create-react-app . --template typescript`

```bash
jackson@192 react-ts % npx create-react-app . --template typescript
Need to install the following packages:
create-react-app@5.1.0
Ok to proceed? (y) y


Creating a new React app in /Users/jackson/Documents/Github/TypeScript-Learning/react-ts.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts with cra-template-typescript...


added 1325 packages in 4m

271 packages are looking for funding
  run `npm fund` for details

Installing template dependencies using npm...

added 21 packages, removed 2 packages, and changed 2 packages in 10s

271 packages are looking for funding
  run `npm fund` for details

We detected TypeScript in your project (src/App.test.tsx) and created a tsconfig.json file for you.

Your tsconfig.json has been populated with default values.

Removing template package using npm...


removed 1 package, and audited 1344 packages in 5s

271 packages are looking for funding
  run `npm fund` for details

9 vulnerabilities (3 moderate, 6 high)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

Success! Created react-ts at /Users/jackson/Documents/Github/TypeScript-Learning/react-ts
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd /Users/jackson/Documents/Github/TypeScript-Learning/react-ts
  npm start

Happy hacking!
```

### Project Structure

```bash
jackson@192 react-ts % tree . -L 1                                 
.
├── README.md
├── node_modules
├── package-lock.json
├── package.json
├── public
├── src
└── tsconfig.json

4 directories, 4 files
```


### Start React App

Run `npm start` in terminal. You should see the React app running in your browser at `http://localhost:3000/`.

### Add Header.tsx

New file: `src/Header.tsx`
```TypeScript
export interface Props {
    title: string;
    color?: string;
}

const Header = (props: Props) => {
    return (
        <header>
            <h1 style={{ color: props.color ? props.color : 'black' }}>{props.title}</h1>
        </header>
    )
}

export default Header;
```

New file: `MainApp.tsx`
```TypeScript
import './App.css';
import Header from './Header';

function MainApp() {
  return (
    <div className="App">
      <Header title="TypeScript" color="blue" />
    </div>
  );
}

export default App;
```

Because the CRA-TS wille use JS files by default, we need to change the `src/index.tsx` to use `MainApp.tsx` instead of `App.tsx`. The changes are all modified in `react-ts`.

Until here, I have successfully created a React app with TypeScript and added a simple Header component!


## Gmail fetch

This part includes a small TypeScript script to read Gmail messages and extract verification codes.

What it does
- Uses OAuth 2.0 (Desktop/Installed App + loopback redirect) to get an OAuth token
- Lists recent messages with optional Gmail search query
- Prints email headers and extracts numeric codes from the body

One‑time setup
1) In Google Cloud Console, enable Gmail API for your project.
2) Create an OAuth client of type “Desktop app (Installed)”. The generated JSON must include a redirect_uris entry like ["http://localhost"].
3) Save it at repository root as google_client_secret.json (already git‑ignored).
4) Ensure your network allows Node to reach Google. If you use a local proxy (e.g., Clash), set in your shell:
   - export HTTPS_PROXY=http://127.0.0.1:<http-proxy-port>
   - export HTTP_PROXY=$HTTPS_PROXY
   - export NO_PROXY=localhost,127.0.0.1

Run locally
- First run (interactive auth will open a browser):
  - npm run gmail:fetch
- Filter and extract (examples):
  - GMAIL_QUERY='from:noreply@brandklout.com newer_than:7d' npm run gmail:fetch
  - CODE_REGEX='Your\s+verification\s+code\s+is[:\s]*\*?\s*([0-9]{8})\*?' npm run gmail:fetch

Security
- google_client_secret.json and .credentials/gmail-token.json are ignored by git.
- Do NOT commit secrets. Use GitHub Secrets in CI.

GitHub Actions (CI)
1) In your repo settings → Secrets and variables → Actions, add these secrets:
   - GOOGLE_CLIENT_SECRET_JSON: the entire content of google_client_secret.json
   - GMAIL_TOKENS_JSON: the entire content of .credentials/gmail-token.json (created after the first local auth)
2) A workflow is provided at .github/workflows/gmail-fetch.yml. It restores credentials from secrets and runs npm run gmail:fetch.
3) You can adjust the schedule/filters/regex via workflow envs or repository secrets.

Notes
- If your OAuth consent screen is still in “Testing”, refresh tokens may expire quickly; switch to “In production” for long‑lived refresh tokens.
- The script prefers text/plain parts; if an email body is HTML‑only, snippet is printed and you can extend the parser if needed.

