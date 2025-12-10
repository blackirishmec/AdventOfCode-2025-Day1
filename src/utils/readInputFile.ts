import { PathLike } from 'node:fs';
import { FileHandle, readFile } from 'node:fs/promises';

export const readInputFile = async (
	path: PathLike | FileHandle,
): Promise<string> => await readFile(path, { encoding: 'utf8' });
