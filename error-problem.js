console.log("lets see how abdullah work with the errors");

let sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
 else{sljkd.log('sdlfj')}
};

// this is synchoronous so we will use the try and catch block instead of the then and catch block ( that we mostly used in our express application )

try {

    console.log("This is the sum function you made n", sum( 3));
}
catch(error){
    console.log('else mai likh kuch')
}

try{
consol.log('it works fine ')

}
catch(error){
 console.log('bro e nhi dala ')
}

try{
  console.logg('sdfk')
}
catch(error){
  console.log('logg mia doo hain')
}