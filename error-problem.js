console.log("lets see how abdullah work with the errors");

let sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error ('Bhai jaan galat argument hain!, 2 dal bharway')
};

// this is synchoronous so we will use the try and catch block instead of the then and catch block ( that we mostly used in our express application )

try {

    console.log("This is the sum function you made n", sum( 3));
}
catch(error){
    console.log('yahan tou error hy bhai apky sum function mai ',error)
}

