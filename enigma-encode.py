import json, os

enigma_data = json.load(open('./enigma-data.json', mode='r'))
alphabet = 'abcdefghijklmnopqrstuvwxyz'


class Base25():

    def __init__(self, number=0):
        self.number = number
        self.check_base()

    def check_base(self):
        if self.number > 25:
            self.number = self.number % 26
        elif self.number < 0:
            self.number = self.number % 26

    def add(self, val):
        self.number += val
        self.check_base()
        return self.number

    def sub(self, val):
        self.number -= val
        self.check_base()
        return self.number


class Enigma():

    def __init__(self):
        self.cogs = []
        self.cog_steps = []
        self.cog_pos = []
        self.reflector = ''
        self.plugs = {}
        self.debug = False
        for plug in enigma_data['plugboard'].split(" "):
            plug1 = plug[:1]
            plug2 = plug[1:]
            self.plugs[plug1] = plug2
            self.plugs[plug2] = plug1
        self.use_plugs = True

    def define_cogs(self, cog1: str, cog2: str, cog3: str):
        for cog in [cog1, cog2, cog3]:
            if cog not in enigma_data['cogs']:
                raise Exception(f'cog {cog} missing from enigma-data.json')
            self.cogs.append(enigma_data['cogs'][cog][0])
            self.cog_steps.append(enigma_data['cogs'][cog][1])

    def define_cog_pos(self, cog1: int, cog2: int, cog3: int):
        if not all(cog in range(0, 26) for cog in [cog1, cog2, cog3]):
            raise Exception(f'cog positions must be between 0 and 25')
        self.cog_pos = [Base25(cog1), Base25(cog2), Base25(cog3)]

    def define_reflector(self, reflector: str):
        if reflector not in enigma_data['reflectors']:
            raise Exception(
                f'reflector {reflector} missing from enigma-data.json'
            )
        self.reflector = enigma_data['reflectors'][reflector]

    def advance_cogs(self):
        for step in self.cog_steps[1]:
            if alphabet[self.cog_pos[1].number] == step:
                self.cog_pos[0].add(1)
                self.cog_pos[1].add(1)
        for step in self.cog_steps[2]:
            if alphabet[self.cog_pos[2].number] == step:
                self.cog_pos[1].add(1)
        self.cog_pos[2].add(1)

    def plug_letter(self, letter: str):
        if letter in self.plugs:
            return self.plugs[letter]
        return letter

    def cog_letter(self, letter: str, cog: int, reverse: bool):
        if not reverse:
            enter_index = Base25(
                alphabet.index(letter) + self.cog_pos[cog].number
            )
            exit_letter = self.cogs[cog][enter_index.number].lower()
            exit_index = Base25(
                alphabet.index(exit_letter) - self.cog_pos[cog].number
            )
            return alphabet[exit_index.number].lower()
        else:
            enter_letter = alphabet[
                Base25(
                    alphabet.index(letter) + self.cog_pos[cog].number
                ).number
            ]
            enter_index = Base25(
                self.cogs[cog].index(enter_letter)
            )
            exit_letter = alphabet[enter_index.number].lower()
            exit_index = Base25(
                alphabet.index(exit_letter) - self.cog_pos[cog].number
            )
            return alphabet[exit_index.number].lower()

    def reflect_letter(self, letter: str):
        pos = alphabet.index(letter)
        return self.reflector[pos].lower()

    def encode(self, decode_str: str):
        return_string = ''
        for letter in decode_str:
            letter = letter.lower()
            if letter not in alphabet:
                return_string += letter
                continue
            self.advance_cogs()
            if self.use_plugs:
                letter = self.plug_letter(letter)
            letter = self.cog_letter(letter, 2, False)
            letter = self.cog_letter(letter, 1, False)
            letter = self.cog_letter(letter, 0, False)
            letter = self.reflect_letter(letter)
            letter = self.cog_letter(letter, 0, True)
            letter = self.cog_letter(letter, 1, True)
            letter = self.cog_letter(letter, 2, True)
            if self.use_plugs:
                letter = self.plug_letter(letter)
            if self.debug:
                print(f'appended {letter}')
            return_string += letter
        return return_string


enig_encode = Enigma()
enig_encode.define_cogs('2', '7', '3')
enig_encode.define_reflector('b')
enig_encode.define_cog_pos(1, 10, 7)
enig_encode.use_plugs = True
print(
    enig_encode.encode(
        'When religion and politics travel in the same cart, the riders ' +
        'believe nothing can stand in their way. Their movements become ' +
        'headlong - faster and faster and faster. They put aside all ' +
        'thoughts of obstacles and forget the precipice does not show ' +
        'itself to the man in a blind rush until it\'s too late. ― Frank ' +
        'Herbert, Dune'
    )
)

cwd = os.getcwd()
with open(f'{cwd}\\encode-input.txt', mode='r') as read_file:
    data = read_file.read().replace('\n', '')

enig_encode.define_cog_pos(1, 10, 7)
data = enig_encode.encode(data)

with open(f'{cwd}\\encode-output.txt', mode='w') as write_file:
    write_file.write(data)
