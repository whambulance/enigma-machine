# Enigma Machine
A typescript enigma machine

## Installation

Using npm:

``` bash
$ npm i @whambulance/enigma-machine
```
Import into your project:
``` js
import enigma from 'enigma-machine'
```

## Use

`enigma-machine` currently supports Enigma I rotors 1 through 8, with reflectors UKW b, c, b thin, and c thin.

Initialize the machine as such:
``` js
let machine = new enigma
let solvable = 'There is no escape, we pay for the violence of our ancestors.'

let result = machine.solve(solvable)
return result

$ 'cficm ww wi fjuegd, cs ojj zet zxo xsbspyff la cfb wdbqmjfme.'
```

### Set Inserted rotors

Update the rotors currently inserted. Array positions are handled left to right - `{0: Left, 1: Middle, 2: Right}`
``` js
machine.rotorsSelected = [5, 1, 2]
```

### Set Rotor positions
Update the starting positions of the currently inserted rotors. Array positions are handled the same as rotor selection
``` js
machine.rotorPositions = [5, 1, 2]
```

### Set Inserted Reflector
Update the currently inserted reflector plate
``` js
machine.reflectorSelected = 3
```

### Set Plugboard combinations
Update the inserted plugs for plugboard combinations. Specify an array of two character length strings, each provided string represents a single combination. I.e. `['ab', 'cd']` would make A become B, and D become C.
``` js
machine.plugboard = ['bq', 'cr', 'di', 'ej', 'kw', 'mt', 'os', 'px', 'uz', 'gh']
```

## Supported Rotor list
`key` is the value used to specifiy which rotor you want to use

| Key | Rotor Name | Characters                 |
|-----|------------|----------------------------|
| 0   | I          | ekmflgdqvzntowyhxuspaibrcj |
| 1   | II         | ajdksiruxblhwtmcqgznpyfvoe |
| 2   | III        | bdfhjlcprtxvznyeiwgakmusqo |
| 3   | IV         | esovpzjayquirhxlnftgkdcmwb |
| 4   | V          | vzbrgityupsdnhlxawmjqofeck |
| 5   | VI         | jpgvoumfyqbenhzrdkasxlictw |
| 6   | VII        | nzjhgrcxmyswboufaivlpekqdt |
| 7   | VIII       | fkqhtlxocbjspdzramewniuygv |

## Supported Reflector list
`key` is the value used to specifiy which reflector you want to use

| Key | Reflector Name | Characters                 |
|-----|----------------|----------------------------|
| 0   | UKW B          | yruhqsldpxngokmiebfzcwvjat |
| 1   | UKW C          | fvpjiaoyedrzxwgctkuqsbnmhl |
| 2   | UKW B Thin     | enkqauywjicopblmdxzvfthrgs |
| 3   | UKW C Thin     | rdobjntkvehmlfcwzaxgyipsuq |
