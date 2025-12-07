import { readFile } from 'node:fs/promises';

// * ------------------------ HELPERS ------------------------ * //
const readInput = async (): Promise<string> =>
	await readFile('input.txt', { encoding: 'utf8' });

const getLineArray = (input: string): string[] => input.split('\n');

// * ------------------------  MAIN   ------------------------ * //

const rawInput = await readInput();

const array = getLineArray(rawInput);
console.log('array', array);
