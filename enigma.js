export default class Enigma{

  constructor(data) {
    this.input = data.input;
    this.encode = data.encode;
    this.output = '';
    this.rotors = [];
    this.rotorpos = [];
    this.rotorsteps = [];
    this.reflector = this.enig_data.reflectors[data.reflector];
    this.plugboard = {};
    for (const i in data.rotors.rottyp) {
      var pull_no = Number(data.rotors.rottyp[i]);
      this.rotors.push(this.enig_data.rotors[pull_no][0]);
      this.rotorsteps.push(this.enig_data.rotors[pull_no][1]);
    }
    for (const i in data.rotors.rotpos) {
      this.rotorpos.push(Number(data.rotors.rotpos[i]));
    }
    var plugarray = data.plugboard.split(" ");
    for (var i = 0; i < plugarray.length; i++) {
      var plug = plugarray[i];
      if (plug.length === 2) {
        var x = plug.split("");
        var y = this.alpha.indexOf(x[0]);
        var z = this.alpha.indexOf(x[1]);
        if (!(y in this.plugboard)) {
          this.plugboard[y] = z;
        }
        if (!(z in this.plugboard)) {
          this.plugboard[z] = y;
        }
      }
    }
  }

  alpha = 'abcdefghijklmnopqrstuvwxyz';

  enig_data = {
    "rotors": {
        0: ["ekmflgdqvzntowyhxuspaibrcj", ["q"]],
        1: ["ajdksiruxblhwtmcqgznpyfvoe", ["e"]],
        2: ["bdfhjlcprtxvznyeiwgakmusqo", ["v"]],
        3: ["esovpzjayquirhxlnftgkdcmwb", ["j"]],
        4: ["vzbrgityupsdnhlxawmjqofeck", ["z"]],
        5: ["jpgvoumfyqbenhzrdkasxlictw", ["z", "m"]],
        6: ["nzjhgrcxmyswboufaivlpekqdt", ["z", "m"]],
        7: ["fkqhtlxocbjspdzramewniuygv", ["z", "m"]]
    },
    "reflectors": {
        0:  "yruhqsldpxngokmiebfzcwvjat",
        1:  "fvpjiaoyedrzxwgctkuqsbnmhl",
        2:  "enkqauywjicopblmdxzvfthrgs",
        3:  "rdobjntkvehmlfcwzaxgyipsuq"
    },
    "plugboard": "in be aq sd xp gz ck mr wy jv"
  };

  solve() {
    for (var i = 0; i < this.input.length; i++) {
      var letter = this.input[i].toLowerCase();
      if (!letter.match(/^[0-9a-z]+$/)) {
        this.output += letter; 
        continue; 
      }
      this.advanceRotor();
      var letnum = this.alpha.indexOf(letter)
      letnum = this.calcPlugboard(letnum);
      letnum = this.calcRotor(letnum, 2, true);
      letnum = this.calcRotor(letnum, 1, true); 
      letnum = this.calcRotor(letnum, 0, true);
      letnum = this.calcReflect(letnum);
      letnum = this.calcRotor(letnum, 0, false);
      letnum = this.calcRotor(letnum, 1, false); 
      letnum = this.calcRotor(letnum, 2, false);
      letnum = this.calcPlugboard(letnum);
      letter = this.alpha[letnum];
      this.output += letter;
    }
    return this.output;
  }

  b25add(baseval, addval) {
    baseval += addval;
    if (baseval > 25) {
      return baseval % 25 - 1;
    } else if (baseval < 0) {
      return 25 + baseval + 1;
    } else {
      return baseval;
    }
  }

  advanceRotor() {
    var step = '';
    for (const i in this.rotorsteps[1]) {
      step = this.alpha.indexOf(this.rotorsteps[1][i])
      if (this.rotorpos[1] == step) {
        this.rotorpos[1] = this.b25add(this.rotorpos[1], 1);
        this.rotorpos[0] = this.b25add(this.rotorpos[0], 1);
      }
    }
    for (const i in this.rotorsteps[2]) {
      step = this.alpha.indexOf(this.rotorsteps[2][i]);
      if (this.rotorpos[2] == step) {
        this.rotorpos[1] = this.b25add(this.rotorpos[1], 1);
      }
    }
    this.rotorpos[2] = this.b25add(this.rotorpos[2], 1);
  }

  calcReflect(input) {
    return this.alpha.indexOf(this.reflector[input]);
  }

  calcRotor(input, rotornum, firstpass) {
    var endvar = ~this.rotorpos[rotornum] + 1;
    if (firstpass) {
      return this.b25add(this.alpha.indexOf(this.rotors[rotornum][this.b25add(input, this.rotorpos[rotornum])]), endvar);
    } else {
      return this.b25add(this.rotors[rotornum].indexOf(this.alpha[this.b25add(input, this.rotorpos[rotornum])]), endvar);
    }
  }

  calcPlugboard(input) {
    if (input in this.plugboard) {
      return this.plugboard[input];
    } else {
      return input;
    }
  }

}
