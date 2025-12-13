import { readInputFile } from '@/utils/readInputFile.js';

// * ------------------------   ENV   ------------------------ * //
const EXAMPLE_PRODUCT_ID_RANGE =
	'11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124';

// * ------------------------  TYPES  ------------------------ * //
type InvalidIdSums = {
	partOne: number;
	partTwo: number;
};

// * ------------------------ CLASSES ------------------------ * //
class ProductIdRange {
	private readonly _firstId: number;
	private readonly _lastId: number;

	private constructor(firstId: number, lastId: number) {
		this._firstId = firstId;
		this._lastId = lastId;
	}

	public static create(productIdRangeString: string) {
		ProductIdRange.validate(productIdRangeString);

		const productIdArray = productIdRangeString.split('-');

		const firstId = Number(productIdArray[0]);
		const lastId = Number(productIdArray[1]);

		if (firstId === undefined) {
			throw new Error(
				'Unable to get the first id from this product id range string!',
			);
		}

		if (lastId === undefined) {
			throw new Error(
				'Unable to get the first id from this product id range string!',
			);
		}

		return new ProductIdRange(firstId, lastId);
	}

	private static validate(productIdRangeString: string): void {
		if (productIdRangeString.includes('-') === false) {
			throw new Error(
				'There was no dash found in this product id range string!',
			);
		}

		if (
			productIdRangeString.includes('-') &&
			productIdRangeString.length <= 1
		) {
			throw new Error(
				'There are no numbers associated with this product id range string!',
			);
		}
	}

	// {Wed, 12/10/25 @21:18} => TY GFG! Came up with an idea to try and solve part two w/ divisors, fully got the code from these legends: (https://www.geeksforgeeks.org/javascript/javascript-program-to-find-all-divisors-of-a-number/)
	private getDivisors(n: number): number[] {
		let result = [];
		for (let i = 1; i <= Math.sqrt(n); i++) {
			if (n % i == 0) {
				result.push(i);
				if (i !== n / i) {
					result.push(n / i);
				}
			}
		}
		return result.sort((a, b) => a - b);
	}

	get firstId(): number {
		return this._firstId;
	}

	get lastId(): number {
		return this._lastId;
	}

	get invalidIdsPartOne(): number[] {
		let invalidIdsPartOne: number[] = [];
		for (
			let idInRange = this.firstId;
			idInRange <= this.lastId;
			idInRange++
		) {
			const idString = idInRange.toString();
			const idDigitCount = idString.length;
			if (idDigitCount % 2 === 0) {
				const sequenceLength = idDigitCount / 2;

				const firstSequence = idString.slice(0, sequenceLength);
				const secondSequence = idString.slice(sequenceLength);

				if (firstSequence == secondSequence) {
					// console.log('idInRangeA', idInRange);

					invalidIdsPartOne.push(idInRange);
				}
			}
		}

		return invalidIdsPartOne;
	}

	get invalidIdsPartTwo(): number[] {
		let invalidIdsPartTwo: number[] = [];
		for (
			let idInRange = this.firstId;
			idInRange <= this.lastId;
			idInRange++
		) {
			const idString = idInRange.toString();
			const idDigitCount = idString.length;

			const idDivisors = this.getDivisors(idDigitCount).filter(
				idDivisor => idDivisor !== 1,
			);

			for (const idDivisor of idDivisors) {
				const sequenceLength = idDigitCount / idDivisor;

				const sequence = idString.slice(0, sequenceLength);

				const repeatedSequence = sequence.repeat(idDivisor);

				if (idString === repeatedSequence) {
					invalidIdsPartTwo.push(idInRange);

					break;
				}
			}
		}

		return invalidIdsPartTwo;
	}

	get invalidIdsPartOneSum(): number {
		return this.invalidIdsPartOne.reduce((acc, invalidId) => {
			acc += invalidId;

			return acc;
		}, 0);
	}

	get invalidIdsPartTwoSum(): number {
		return this.invalidIdsPartTwo.reduce((acc, invalidId) => {
			acc += invalidId;

			return acc;
		}, 0);
	}
}

// * ------------------------ HELPERS ------------------------ * //
const getArrayFromCommaSeparatedStrings = (input: string): string[] =>
	input.split(',');

// * ------------------------  MAIN   ------------------------ * //
const getInvalidIdSums = async (): Promise<InvalidIdSums> => {
	const rawInput = await readInputFile('src/day_two/input.txt');

	const array = getArrayFromCommaSeparatedStrings(rawInput)
		.map(line => line.trim())
		.filter(line => line.length);

	return array.reduce<InvalidIdSums>(
		({ partOne, partTwo }, productIdRangeString) => {
			const productIdRange = ProductIdRange.create(productIdRangeString);

			return {
				partOne: partOne + productIdRange.invalidIdsPartOneSum,
				partTwo: partTwo + productIdRange.invalidIdsPartTwoSum,
			};
		},
		{
			partOne: 0,
			partTwo: 0,
		},
	);
};

const invalidIdSums = await getInvalidIdSums();
console.log('invalidIdSums', invalidIdSums);
