-- WebLearnX Dummy / Seed Data
-- Paste into Aiven Query Editor and click Run All

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Users
-- Passwords are all: password123
-- Hash: $2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `account_status`) VALUES
(1, 'Admin User',       'admin@weblearnx.com',     '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'admin',     'approved'),
(2, 'Zain Ahmed',       'zain@weblearnx.com',       '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'user',      'approved'),
(3, 'Sara Khan',        'sara@weblearnx.com',       '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'user',      'approved'),
(4, 'DevOrg Pakistan',  'devorg@weblearnx.com',     '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'organizer', 'approved'),
(5, 'TechHub Events',   'techhub@weblearnx.com',    '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'organizer', 'approved'),
(6, 'Pending Org',      'pending@weblearnx.com',    '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W', 'organizer', 'pending');

-- --------------------------------------------------------
-- Courses
-- --------------------------------------------------------
INSERT INTO `courses` (`id`, `title`, `description`, `created_by`) VALUES
(1, 'HTML & CSS Fundamentals',  'Learn the building blocks of the web — structure with HTML and styling with CSS.', 1),
(2, 'JavaScript Basics',        'Master the core concepts of JavaScript including variables, functions, and DOM manipulation.', 1),
(3, 'React.js for Beginners',   'Build modern user interfaces with React — components, state, props, and hooks.', 1),
(4, 'Node.js & Express',        'Build backend APIs with Node.js and Express. Learn routing, middleware, and REST principles.', 1),
(5, 'MySQL Database Design',    'Design relational databases, write SQL queries, and understand normalization.', 1);

-- --------------------------------------------------------
-- Articles
-- --------------------------------------------------------
INSERT INTO `articles` (`id`, `title`, `content`, `course_id`, `order`, `created_by`) VALUES
-- HTML & CSS
(1,  'Introduction to HTML',         'HTML stands for HyperText Markup Language. It is the standard language for creating web pages.\n\nEvery HTML document starts with a DOCTYPE declaration followed by the html, head, and body tags.\n\nExample:\n<!DOCTYPE html>\n<html>\n  <head><title>My Page</title></head>\n  <body><h1>Hello World</h1></body>\n</html>', 1, 1, 1),
(2,  'HTML Elements and Tags',        'HTML elements are the building blocks of HTML pages. An element usually consists of a start tag, content, and an end tag.\n\nCommon tags include:\n- <h1> to <h6> for headings\n- <p> for paragraphs\n- <a> for links\n- <img> for images\n- <div> and <span> for containers', 1, 2, 1),
(3,  'Introduction to CSS',           'CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed.\n\nCSS can be added inline, internally in a <style> tag, or externally via a .css file.\n\nExample:\nbody {\n  background-color: lightblue;\n  font-family: Arial, sans-serif;\n}', 1, 3, 1),
(4,  'CSS Box Model',                 'Every HTML element is a box. The CSS box model describes the spacing around elements.\n\nIt consists of:\n- Content: the actual content\n- Padding: space inside the border\n- Border: the border around the padding\n- Margin: space outside the border\n\nUnderstanding the box model is essential for layout design.', 1, 4, 1),
(5,  'CSS Flexbox',                   'Flexbox is a CSS layout model that makes it easy to design flexible and responsive layouts.\n\nKey properties:\n- display: flex\n- flex-direction: row | column\n- justify-content: center | space-between | flex-start\n- align-items: center | flex-start | flex-end\n\nFlexbox eliminates the need for floats and positioning hacks.', 1, 5, 1),

-- JavaScript
(6,  'Variables and Data Types',      'JavaScript has three ways to declare variables: var, let, and const.\n\n- var: function-scoped, avoid in modern JS\n- let: block-scoped, can be reassigned\n- const: block-scoped, cannot be reassigned\n\nData types include: String, Number, Boolean, null, undefined, Object, and Symbol.', 2, 1, 1),
(7,  'Functions in JavaScript',       'Functions are reusable blocks of code. They can be declared in multiple ways:\n\n1. Function declaration:\nfunction greet(name) {\n  return "Hello " + name;\n}\n\n2. Arrow function:\nconst greet = (name) => "Hello " + name;\n\nFunctions can accept parameters and return values.', 2, 2, 1),
(8,  'Arrays and Objects',            'Arrays store ordered lists of values:\nconst fruits = ["apple", "banana", "mango"];\n\nObjects store key-value pairs:\nconst person = { name: "Ali", age: 25 };\n\nYou can access object properties with dot notation (person.name) or bracket notation (person["name"]).', 2, 3, 1),
(9,  'DOM Manipulation',              'The Document Object Model (DOM) represents the HTML document as a tree of objects.\n\nJavaScript can manipulate the DOM:\n- document.getElementById("id")\n- document.querySelector(".class")\n- element.innerHTML = "new content"\n- element.style.color = "red"\n- element.addEventListener("click", handler)', 2, 4, 1),

-- React
(10, 'What is React?',                'React is a JavaScript library for building user interfaces, developed by Facebook.\n\nKey concepts:\n- Components: reusable UI pieces\n- JSX: JavaScript + HTML syntax\n- Virtual DOM: React updates only what changed\n\nReact apps are built by composing small components into larger ones.', 3, 1, 1),
(11, 'Components and Props',          'Components are the building blocks of React apps. They can be functional or class-based.\n\nFunctional component example:\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nProps are read-only data passed from parent to child components.', 3, 2, 1),
(12, 'State and useState Hook',       'State allows components to store and update data over time.\n\nExample:\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}', 3, 3, 1),
(13, 'useEffect Hook',                'useEffect runs side effects in functional components — like fetching data or updating the DOM.\n\nExample:\nuseEffect(() => {\n  fetch("/api/data")\n    .then(res => res.json())\n    .then(data => setData(data));\n}, []); // empty array = run once on mount', 3, 4, 1),

-- Node.js
(14, 'Introduction to Node.js',       'Node.js is a JavaScript runtime built on Chrome V8 engine. It allows running JavaScript on the server.\n\nKey features:\n- Non-blocking I/O\n- Event-driven architecture\n- npm package ecosystem\n\nNode.js is ideal for building fast, scalable network applications.', 4, 1, 1),
(15, 'Express.js Routing',            'Express is a minimal web framework for Node.js.\n\nBasic server:\nconst express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello World");\n});\n\napp.listen(3000);\n\nRoutes can handle GET, POST, PUT, DELETE requests.', 4, 2, 1),
(16, 'Middleware in Express',         'Middleware functions have access to req, res, and next. They run between the request and response.\n\nExample:\napp.use((req, res, next) => {\n  console.log("Request received:", req.method, req.url);\n  next(); // pass to next middleware\n});\n\nCommon middleware: express.json(), cors(), authentication checks.', 4, 3, 1),

-- MySQL
(17, 'Introduction to Databases',     'A database is an organized collection of structured data. Relational databases store data in tables with rows and columns.\n\nMySQL is one of the most popular relational database management systems.\n\nKey concepts:\n- Tables: store data in rows and columns\n- Primary Key: unique identifier for each row\n- Foreign Key: links two tables together', 5, 1, 1),
(18, 'Basic SQL Queries',             'SQL (Structured Query Language) is used to interact with relational databases.\n\nCommon commands:\n- SELECT * FROM users;\n- INSERT INTO users (name, email) VALUES ("Ali", "ali@test.com");\n- UPDATE users SET name = "Ahmed" WHERE id = 1;\n- DELETE FROM users WHERE id = 1;\n\nAlways use WHERE with UPDATE and DELETE to avoid affecting all rows.', 5, 2, 1),
(19, 'Joins in SQL',                  'Joins combine rows from two or more tables based on a related column.\n\nTypes:\n- INNER JOIN: returns rows with matching values in both tables\n- LEFT JOIN: returns all rows from left table + matched rows from right\n- RIGHT JOIN: returns all rows from right table + matched rows from left\n\nExample:\nSELECT users.name, orders.total\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;', 5, 3, 1);

-- --------------------------------------------------------
-- Cheatsheets
-- --------------------------------------------------------
INSERT INTO `cheatsheets` (`id`, `title`, `slug`, `category`, `content`, `created_by`) VALUES
(1, 'HTML Quick Reference',    'html-quick-reference',    'HTML',       '=== HTML CHEATSHEET ===\n\nDOCTYPE\n-------\n<!DOCTYPE html>\n\nBASIC STRUCTURE\n---------------\n<html>\n  <head>\n    <title>Page Title</title>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  </head>\n  <body>\n    Content here\n  </body>\n</html>\n\nHEADINGS\n--------\n<h1> to <h6>\n\nTEXT\n----\n<p>          Paragraph\n<strong>     Bold\n<em>         Italic\n<br>         Line break\n<hr>         Horizontal rule\n\nLINKS & IMAGES\n--------------\n<a href="url">Link text</a>\n<img src="image.jpg" alt="description">\n\nLISTS\n-----\n<ul><li>Unordered</li></ul>\n<ol><li>Ordered</li></ol>\n\nFORMS\n-----\n<form action="/submit" method="POST">\n  <input type="text" name="name">\n  <input type="email" name="email">\n  <input type="password" name="pass">\n  <button type="submit">Submit</button>\n</form>\n\nTABLES\n------\n<table>\n  <thead><tr><th>Col1</th><th>Col2</th></tr></thead>\n  <tbody><tr><td>Data1</td><td>Data2</td></tr></tbody>\n</table>', 1),

(2, 'CSS Quick Reference',     'css-quick-reference',     'CSS',        '=== CSS CHEATSHEET ===\n\nSELECTORS\n---------\nelement        p { }\nclass          .className { }\nid             #idName { }\nall            * { }\nchild          div > p { }\ndescendant     div p { }\n\nCOLORS\n------\ncolor: red;\ncolor: #ff0000;\ncolor: rgb(255, 0, 0);\nbackground-color: lightblue;\n\nTEXT\n----\nfont-size: 16px;\nfont-family: Arial, sans-serif;\nfont-weight: bold;\ntext-align: center | left | right;\ntext-decoration: none | underline;\nline-height: 1.5;\n\nBOX MODEL\n---------\nwidth: 100px;\nheight: 100px;\npadding: 10px;\nmargin: 10px;\nborder: 1px solid black;\nborder-radius: 5px;\n\nFLEXBOX\n-------\ndisplay: flex;\nflex-direction: row | column;\njustify-content: center | space-between | flex-start | flex-end;\nalign-items: center | flex-start | flex-end;\ngap: 10px;\n\nPOSITIONING\n-----------\nposition: static | relative | absolute | fixed | sticky;\ntop / right / bottom / left: 0;\nz-index: 1;\n\nRESPONSIVE\n----------\n@media (max-width: 768px) {\n  .container { flex-direction: column; }\n}', 1),

(3, 'JavaScript ES6+',         'javascript-es6',           'JavaScript', '=== JAVASCRIPT ES6+ CHEATSHEET ===\n\nVARIABLES\n---------\nconst name = "Ali";      // cannot reassign\nlet age = 25;            // can reassign\n\nARROW FUNCTIONS\n---------------\nconst add = (a, b) => a + b;\nconst greet = name => `Hello ${name}`;\n\nTEMPLATE LITERALS\n-----------------\nconst msg = `Hello ${name}, you are ${age} years old`;\n\nDESTRUCTURING\n-------------\nconst { name, age } = person;\nconst [first, second] = array;\n\nSPREAD OPERATOR\n---------------\nconst newArr = [...arr1, ...arr2];\nconst newObj = { ...obj1, ...obj2 };\n\nARRAY METHODS\n-------------\narr.map(x => x * 2)        // transform each element\narr.filter(x => x > 5)     // keep matching elements\narr.find(x => x.id === 1)  // find first match\narr.reduce((acc, x) => acc + x, 0)  // accumulate\narr.forEach(x => console.log(x))    // iterate\n\nPROMISES & ASYNC/AWAIT\n----------------------\nconst fetchData = async () => {\n  try {\n    const res = await fetch("/api/data");\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n};\n\nMODULES\n-------\nexport const myFunc = () => {};\nexport default MyComponent;\nimport { myFunc } from "./utils";\nimport MyComponent from "./MyComponent";', 1),

(4, 'React Hooks Reference',   'react-hooks',             'React',      '=== REACT HOOKS CHEATSHEET ===\n\nuseState\n--------\nconst [value, setValue] = useState(initialValue);\nsetValue(newValue);\nsetValue(prev => prev + 1); // functional update\n\nuseEffect\n---------\nuseEffect(() => {\n  // runs after every render\n});\n\nuseEffect(() => {\n  // runs once on mount\n}, []);\n\nuseEffect(() => {\n  // runs when dependency changes\n}, [dependency]);\n\nuseEffect(() => {\n  return () => { /* cleanup */ };\n}, []);\n\nuseContext\n----------\nconst value = useContext(MyContext);\n\nuseRef\n------\nconst ref = useRef(null);\n<input ref={ref} />\nref.current.focus();\n\nuseMemo\n-------\nconst result = useMemo(() => expensiveCalc(a, b), [a, b]);\n\nuseCallback\n-----------\nconst handler = useCallback(() => {\n  doSomething(id);\n}, [id]);\n\nCUSTOM HOOK\n-----------\nfunction useLocalStorage(key, initial) {\n  const [value, setValue] = useState(\n    () => JSON.parse(localStorage.getItem(key)) ?? initial\n  );\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}', 1),

(5, 'SQL Quick Reference',     'sql-quick-reference',     'Database',   '=== SQL CHEATSHEET ===\n\nCREATE TABLE\n------------\nCREATE TABLE users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT\n------\nINSERT INTO users (name, email) VALUES ("Ali", "ali@test.com");\n\nSELECT\n------\nSELECT * FROM users;\nSELECT name, email FROM users WHERE id = 1;\nSELECT * FROM users ORDER BY created_at DESC;\nSELECT * FROM users LIMIT 10 OFFSET 20;\n\nUPDATE\n------\nUPDATE users SET name = "Ahmed" WHERE id = 1;\n\nDELETE\n------\nDELETE FROM users WHERE id = 1;\n\nJOINS\n-----\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\nLEFT JOIN returns all from left table.\nINNER JOIN returns only matching rows.\n\nAGGREGATES\n----------\nSELECT COUNT(*) FROM users;\nSELECT AVG(price) FROM products;\nSELECT MAX(salary) FROM employees;\nSELECT department, COUNT(*) FROM employees GROUP BY department;\n\nINDEXES\n-------\nCREATE INDEX idx_email ON users(email);\nALTER TABLE users ADD UNIQUE KEY email (email);', 1);

-- --------------------------------------------------------
-- Hackathons
-- --------------------------------------------------------
INSERT INTO `hackathons` (`id`, `title`, `description`, `banner`, `start_date`, `end_date`, `status`, `organizer_id`, `registration_link`) VALUES
(1, 'AI Innovation Challenge 2026',    'Build AI-powered solutions to real-world problems. Open to all skill levels. Prizes worth $10,000.',                                          'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800', '2026-06-15 09:00:00', '2026-06-17 18:00:00', 'upcoming',  4, 'https://devpost.com'),
(2, 'Web Dev Hackathon Pakistan',      'A 48-hour hackathon focused on building web applications that solve local problems in Pakistan.',                                            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', '2026-06-01 10:00:00', '2026-06-03 10:00:00', 'active',    4, 'https://devpost.com'),
(3, 'Open Source Sprint',              'Contribute to open source projects over a weekend. Mentors available. Great for beginners.',                                               'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800', '2026-05-10 08:00:00', '2026-05-12 20:00:00', 'completed', 5, 'https://github.com'),
(4, 'FinTech Hackathon 2026',          'Build the future of financial technology. Focus areas: payments, lending, insurance, and blockchain.',                                     'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', '2026-07-05 09:00:00', '2026-07-07 18:00:00', 'upcoming',  5, 'https://devpost.com'),
(5, 'Climate Tech Challenge',          'Use technology to fight climate change. Build solutions for renewable energy, waste reduction, or carbon tracking.',                       'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800', '2026-07-20 09:00:00', '2026-07-22 18:00:00', 'upcoming',  4, 'https://devpost.com'),
(6, 'Mobile App Hackathon',            'Design and build a mobile app in 36 hours. React Native, Flutter, or native iOS/Android — your choice.',                                  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', '2026-08-01 10:00:00', '2026-08-03 10:00:00', 'upcoming',  5, 'https://devpost.com'),
(7, 'EdTech Innovation Hackathon',     'Build tools that improve education and learning. Focus on accessibility, engagement, and personalized learning.',                          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', '2026-08-15 09:00:00', '2026-08-17 18:00:00', 'upcoming',  4, 'https://devpost.com'),
(8, 'Cybersecurity CTF 2026',          'Capture The Flag competition. Test your security skills across web, crypto, forensics, and reverse engineering challenges.',               'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', '2026-09-01 00:00:00', '2026-09-03 00:00:00', 'upcoming',  5, 'https://ctftime.org');

-- --------------------------------------------------------
-- Bookmarks (user 2 bookmarks some hackathons)
-- --------------------------------------------------------
INSERT INTO `bookmarks` (`user_id`, `hackathon_id`) VALUES
(2, 1),
(2, 4),
(3, 2),
(3, 5);

-- --------------------------------------------------------
-- Progress (user 2 completed some articles)
-- --------------------------------------------------------
INSERT INTO `progress` (`user_id`, `article_id`) VALUES
(2, 1),
(2, 2),
(2, 3),
(2, 6),
(2, 7),
(3, 1),
(3, 10),
(3, 11);

SET FOREIGN_KEY_CHECKS = 1;
