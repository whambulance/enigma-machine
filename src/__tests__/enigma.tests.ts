import enigma from '../enigma';

test('Enigma solve test', () => {
  let machine = new enigma();

  machine.rotorPositions = [0, 0, 25];
  expect(machine.reflectorSelected).toBe(0);
  expect(machine.rotorsSelected).toStrictEqual([0, 0, 0]);
  expect(machine.rotorPositions).toStrictEqual([0, 0, 25]);
  expect(machine.plugboardSelections).toStrictEqual([]);

  let result = machine.solve('There is no escape, we pay for the violence of our ancestors.');
  expect(result).toBe('rgmud sj vc alapkw, xo yts vvu rvl xblnymfj se nsj fbzduxakg.');

  machine.rotorsSelected = [5, 0, 2];
  machine.rotorPositions = [0, 16, 11];

  result = machine.solve('There is no escape, we pay for the violence of our ancestors.');
  expect(result).toBe('csbsz qj yd gewrsw, ow top rxl ick phuawtwf ps kwo bjflacczf.');
});

test('Enigma b25add test', () => {
  let machine = new enigma();

  expect(machine.b25add(1, 2)).toBe(3);
  expect(machine.b25add(15, 10)).toBe(25);
  expect(machine.b25add(25, 1)).toBe(0);
  expect(machine.b25add(0, -1)).toBe(25);
});

test('Enigma reflector test', () => {
  let machine = new enigma();

  expect(machine.reflectorSelected).toBe(0);
  expect(machine.calcReflect(0)).toBe(24);
  expect(machine.calcReflect(15)).toBe(8);
  expect(machine.calcReflect(25)).toBe(19);

  // testing bottom text example
  expect(machine.calcReflect(16)).toBe(4);
});

test('Enigma advance rotor test', () => {
  let machine = new enigma();

  machine.rotorPositions = [0, 0, 25];
  expect(machine.rotorPositions).toStrictEqual([0, 0, 25]);
  machine.advanceRotor();
  expect(machine.rotorPositions).toStrictEqual([0, 0, 0]);
  machine.advanceRotor();
  expect(machine.rotorPositions).toStrictEqual([0, 0, 1]);
});

test('Enigma rotor test', () => {
  let machine = new enigma();

  expect(machine.rotorsSelected).toStrictEqual([0, 0, 0]);
  expect(machine.calcRotor(0, 0, true)).toBe(4);
  expect(machine.calcRotor(15, 0, true)).toBe(7);
  expect(machine.calcRotor(25, 0, true)).toBe(9);

  // testing bottom text example
  expect(machine.calcRotor(19, 0, true)).toBe(15);
  expect(machine.calcRotor(15, 0, true)).toBe(7);
  expect(machine.calcRotor(7, 0, true)).toBe(16);

  expect(machine.calcRotor(4, 0, false)).toBe(0);
  expect(machine.calcRotor(0, 0, false)).toBe(20);
  expect(machine.calcRotor(20, 0, false)).toBe(17);
});

test('Enigma plugboard test', () => {
  let machine = new enigma();

  machine.plugboardSelections = ['ab', 'cd', 'ef'];
  expect(machine.plugboardSelections).toStrictEqual(['ab', 'cd', 'ef']);
  expect(machine.calcPlugboard(7)).toBe(7);
  expect(machine.calcPlugboard(0)).toBe(1);
  expect(machine.calcPlugboard(1)).toBe(0);
  expect(machine.calcPlugboard(2)).toBe(3);
  expect(machine.calcPlugboard(4)).toBe(5);
  expect(machine.calcPlugboard(6)).toBe(6);
});
