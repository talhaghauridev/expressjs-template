const name_talha = 'hello'; // → ESLint error: 'unused' is defined but never used
console.log(name_talha); // → Warning/Error: Unexpected console statement
function bad(param: any) {
  console.log({ param });
} // → Error: Avoid using 'any'
bad({});

const fine = 'Talha';
