import enigmadata_import from './enigma-data.json';

interface Rotor {
  name: string;
  rotor: string;
  steps: string[];
}

interface Reflector {
  name: string;
  reflector: string;
}

interface EnigmaData {
  alpha: string;
  rotors: Rotor[];
  reflectors: Reflector[];
}

export default class Enigma {
  rotorsSelected: number[] = [0, 0, 0];
  rotorPositions: number[] = [0, 0, 0];
  reflectorSelected: number = 0;
  plugboardSelections: string[] = [];

  enigmadata: EnigmaData = enigmadata_import;

  /**
   * Solve a string with the current settings
   * @param input The string to be solved
   * @returns The solved string
   */
  solve(input: string): string {
    let output = '';

    // for (var i = 0; i < input.length; i++) {
    for (let letter of input) {
      letter = letter.toLowerCase();

      if (!letter.match(/^[0-9a-z]+$/)) {
        output += letter;
        continue;
      }

      this.advanceRotor();
      let letterIndex = this.enigmadata.alpha.indexOf(letter);
      letterIndex = this.calcPlugboard(letterIndex);
      letterIndex = this.calcRotor(letterIndex, 2, true);
      letterIndex = this.calcRotor(letterIndex, 1, true);
      letterIndex = this.calcRotor(letterIndex, 0, true);
      letterIndex = this.calcReflect(letterIndex);
      letterIndex = this.calcRotor(letterIndex, 0, false);
      letterIndex = this.calcRotor(letterIndex, 1, false);
      letterIndex = this.calcRotor(letterIndex, 2, false);
      letterIndex = this.calcPlugboard(letterIndex);
      letter = this.enigmadata.alpha[letterIndex];
      output += letter;
    }
    return output;
  }

  /**
   * Add two numbers, this function adss in a base-25 manner,
   * meaning it can't equal a number larger than 25 or less
   * than 0
   * @param baseval Number to be added to
   * @param addval Number to add
   * @returns Addition result
   */
  b25add(baseval: number, addval: number): number {
    baseval += addval;
    if (baseval > 25) {
      return (baseval % 25) - 1;
    } else if (baseval < 0) {
      return 25 + baseval + 1;
    }
    return baseval;
  }

  /**
   * Advances the primary rotor, and cascades rotation to
   * other rotors based on their rotor steps
   */
  advanceRotor(): void {
    const rotorSteps1 = this.enigmadata.rotors[this.rotorsSelected[1]].steps;
    rotorSteps1.forEach((step) => {
      const stepIndex = this.enigmadata.alpha.indexOf(step);
      if (this.rotorPositions[1] === stepIndex) {
        this.rotorPositions[1] = this.b25add(this.rotorPositions[1], 1);
        this.rotorPositions[0] = this.b25add(this.rotorPositions[0], 1);
      }
    });

    const rotorSteps2 = this.enigmadata.rotors[this.rotorsSelected[2]].steps;
    rotorSteps2.forEach((step) => {
      const stepIndex = this.enigmadata.alpha.indexOf(step);
      if (this.rotorPositions[2] === stepIndex) {
        this.rotorPositions[1] = this.b25add(this.rotorPositions[1], 1);
      }
    });

    this.rotorPositions[2] = this.b25add(this.rotorPositions[2], 1);
  }

  /**
   * Passes a signal off of the reflector, using the reflector
   * currently set
   * @param letterIndex Current letter index
   * @returns New letter index post-reflection
   */
  calcReflect(letterIndex: number) {
    const reflector = this.enigmadata.reflectors[this.reflectorSelected].reflector;
    return this.enigmadata.alpha.indexOf(reflector[letterIndex]);
  }

  /**
   * Passes a signal through a given rotor, and returns the new
   * letter index
   * @param letterIndex  Current letter index
   * @param rotornum The rotor to send signal through L/M/R = 0/1/2
   * @param firstpass Whether this is the first pass through the rotor
   * @returns New letter index post-transform
   */
  calcRotor(letterIndex: number, rotornum: number, firstpass: boolean): number {
    const endval: number = -Math.abs(this.rotorPositions[rotornum]);
    const rotor: string = this.enigmadata.rotors[this.rotorsSelected[rotornum]].rotor;
    const alpha: string = this.enigmadata.alpha;

    const newIndex: number = this.b25add(letterIndex, this.rotorPositions[rotornum]);
    const startval: number = firstpass ? alpha.indexOf(rotor[newIndex]) : rotor.indexOf(alpha[newIndex]);

    return this.b25add(startval, endval);
  }

  /**
   * Passes a signal through the plugboard
   * @param letterIndex Current letter index
   * @returns New letter index post-plugboard
   */
  calcPlugboard(letterIndex: number): any {
    const letter = this.enigmadata.alpha[letterIndex];

    const selectedPlug = this.plugboardSelections.find((plug: string) => {
      return plug.includes(letter);
    });

    if (selectedPlug) {
      return this.enigmadata.alpha.indexOf(selectedPlug.replace(letter, ''));
    } else {
      return letterIndex;
    }
  }
}
