import { readInputFile } from '@/utils/readInputFile.js';

// * ------------------------   ENV   ------------------------ * //
const EXAMPLE_PRODUCT_ID_RANGE =
	'11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124';

// * ------------------------  TYPES  ------------------------ * //

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

	get firstId(): number {
		return this._firstId;
	}

	get lastId(): number {
		return this._lastId;
	}

	get invalidIds(): number[] {
		let invalidIds: number[] = [];
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

				if (firstSequence == secondSequence) invalidIds.push(idInRange);
			}
		}

		return invalidIds;
	}

	get invalidIdsSum(): number {
		return this.invalidIds.reduce((acc, invalidId) => {
			acc += invalidId;

			return acc;
		}, 0);
	}
}

// * ------------------------ HELPERS ------------------------ * //
const getArrayFromCommaSeparatedStrings = (input: string): string[] =>
	input.split(',');

// * ------------------------  MAIN   ------------------------ * //
const getInvalidIdSum = async (): Promise<number> => {
	const rawInput = await readInputFile('src/day_two/input.txt');

	const array = getArrayFromCommaSeparatedStrings(rawInput)
		.map(line => line.trim())
		.filter(line => line.length);

	return array.reduce((acc, productIdRangeString) => {
		const productIdRange = ProductIdRange.create(productIdRangeString);

		return acc + productIdRange.invalidIdsSum;
	}, 0);
};

const invalidIdSum = await getInvalidIdSum();
console.log('invalidIdSum', invalidIdSum);
