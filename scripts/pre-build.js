const { join } = require("path");
const keypair = require("../facto-keypair.json");
const { writeFile } = require("fs/promises");

var to_b58 = function(
    B,            //Uint8Array raw byte input
    A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"              //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [],   //the array for storing the stream of base58 digits
        s = "",   //the result string variable that will be returned
        i,        //the iterator variable for the byte input
        j,        //the iterator variable for the base58 digit array (d)
        c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n;        //a temporary placeholder variable for the current base58 digit
    for(i in B) { //loop through each byte in the input stream
        j = 0,                           //reset the base58 digit iterator
        c = B[i];                        //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
            n = d[j];                    //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++                          //iterate to the next base58 digit
        }
    }
    while(j--)        //since the base58 digits are backwards, loop through them in reverse order
        s += A[d[j]]; //lookup the character associated with each base58 digit
    return s          //return the final base58 string
}

/**
 * 
 * @param {Uint8Array} privateKey 
 */
const privateToPublic = (privateKey) => {
    const publicKey = new Uint8Array(32);
    for(let i = 0; i < privateKey.length; i++) publicKey[i] = privateKey[i + 32];
    return to_b58(publicKey);
}

const base58 = privateToPublic(new Uint8Array(keypair));

(async () => {
    const dotenv = await writeFile(join(__dirname, "..", ".env"), `#file auto-generated\nFACTO_PROGRAM_ID=${base58}`)
})();