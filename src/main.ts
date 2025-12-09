import { readFile } from 'node:fs/promises';

// * ------------------------   ENV   ------------------------ * //
const DIAL_STARTING_VALUE = 50;

// * ------------------------  TYPES  ------------------------ * //
type SpinDirection = 'left' | 'right';

// * ------------------------ CLASSES ------------------------ * //
class SafeDialValue {
	private static readonly MIN: number = 0;
	private static readonly MAX: number = 99;
	private readonly _value: number;

	private constructor(newValue: number) {
		this._value = newValue;
	}

	private static validate(newValue: number): void {
		if (newValue < SafeDialValue.MIN) {
			throw new RangeError(
				`${newValue} is lower than '${SafeDialValue.MIN}' which is the minimum possible value for this safe dial!`,
			);
		}

		if (newValue > SafeDialValue.MAX) {
			throw new RangeError(
				`${newValue} is higher than '${SafeDialValue.MAX}' which is the highest possible value for this safe dial!`,
			);
		}
	}

	static create(newValue?: number): SafeDialValue {
		const sanitizedValue = newValue ?? DIAL_STARTING_VALUE;

		SafeDialValue.validate(sanitizedValue);

		return new SafeDialValue(sanitizedValue);
	}

	get value(): number {
		return this._value;
	}
}

class RotationInstruction {
	private readonly _value: string;

	private constructor(newValue: string) {
		this._value = newValue.trim().toLowerCase();
	}

	private static validate(newValue: string): void {
		const sanitizedValue = newValue.trim().toLowerCase();

		if (sanitizedValue.length < 2 || sanitizedValue.length > 4) {
			throw new Error(
				`${sanitizedValue} must be between 2 and 4 characters long!`,
			);
		}

		const directionLetter: string | undefined = sanitizedValue[0];
		if (directionLetter === undefined) {
			throw new Error(`sanitizedValue must not be an empty string!`);
		}

		if (!['l', 'r'].includes(directionLetter)) {
			throw new Error(`${directionLetter} must be either 'l' or 'r'!`);
		}

		const turnNumberString: string | undefined = sanitizedValue
			.substring(1)
			.trim();
		if (turnNumberString === undefined) {
			throw new Error(`turnNumberString must not be an empty string!`);
		}

		const turnNumber: number = Number(turnNumberString);
		if (Number.isNaN(turnNumber)) {
			throw new TypeError(`turnNumber must be a number!`);
		}
	}

	static create(newValue: string): RotationInstruction {
		RotationInstruction.validate(newValue);

		return new RotationInstruction(newValue);
	}

	get value(): string {
		return this._value;
	}

	get direction(): SpinDirection {
		return this.value.startsWith('l') ? 'left' : 'right';
	}

	get distance(): number {
		return Number(this.value.slice(1));
	}
}

class Counter {
	private readonly _value: number;
	private static readonly _DEFAULT_STARTING_VALUE: number = 0;

	private constructor(newValue: number) {
		this._value = newValue;
	}

	private static validate(newValue: number): void {
		if (Number.isNaN(newValue)) {
			throw new TypeError(`newValue must be a number!`);
		}

		if (newValue < 0) {
			throw new RangeError(
				`${newValue} is negative yet must be greater than or equal to zero!`,
			);
		}
	}

	static create(newValue?: number): Counter {
		const sanitizedValue = newValue ?? Counter._DEFAULT_STARTING_VALUE;

		Counter.validate(sanitizedValue);

		return new Counter(sanitizedValue);
	}

	get value(): number {
		return this._value;
	}
}

class SafeDial {
	private _value: SafeDialValue = SafeDialValue.create();
	private _zeroCounter: Counter = Counter.create();

	private constructor() {}

	static create(): SafeDial {
		return new SafeDial();
	}

	private spinRight(distance: number): void {
		let updatedValue = this.currentValue;
		for (let i = 0; i < distance; i++) {
			const nextCounterValue = updatedValue + 1;

			if (nextCounterValue === 100) {
				updatedValue = 0;
			} else {
				updatedValue += 1;
			}
		}

		if (updatedValue === 0) this.incrementZeroCounter();

		this._value = SafeDialValue.create(updatedValue);
	}

	private spinLeft(distance: number): void {
		let updatedValue = this.currentValue;
		for (let i = 0; i < distance; i++) {
			const nextCounterValue = updatedValue - 1;

			if (nextCounterValue === -1) {
				updatedValue = 99;
			} else {
				updatedValue -= 1;
			}
		}

		if (updatedValue === 0) this.incrementZeroCounter();

		this._value = SafeDialValue.create(updatedValue);
	}

	rotate({ direction, distance }: RotationInstruction): void {
		if (direction === 'left') {
			this.spinLeft(distance);
		} else {
			this.spinRight(distance);
		}
	}

	get currentValue(): number {
		return this._value.value;
	}

	get zeroCounter(): Counter {
		return this._zeroCounter;
	}

	get zeroCounterCurrentValue(): number {
		return this._zeroCounter.value;
	}

	private setZeroCounterValue(newValue: number) {
		this._zeroCounter = Counter.create(newValue);
	}

	private incrementZeroCounter() {
		this.setZeroCounterValue(this.zeroCounter.value + 1);
	}

	public resetZeroCounter() {
		this._zeroCounter = Counter.create();
	}
}

// * ------------------------ HELPERS ------------------------ * //
const readInputFile = async (): Promise<string> =>
	await readFile('input.txt', { encoding: 'utf8' });

const getArrayFromLines = (input: string): string[] => input.split('\n');

// * ------------------------  MAIN   ------------------------ * //
const getSafeDoorPassword = async (): Promise<{
	currentValue: number;
	zeroCount: number;
}> => {
	const rawInput = await readInputFile();

	const array = getArrayFromLines(rawInput)
		.map(line => line.trim())
		.filter(line => line.length);

	const safeDial = SafeDial.create();

	for (const line of array) {
		const rotationInstructionForLine = RotationInstruction.create(line);

		safeDial.rotate(rotationInstructionForLine);
	}

	return {
		currentValue: safeDial.currentValue,
		zeroCount: safeDial.zeroCounterCurrentValue,
	};
};

const safeDoorPassword = await getSafeDoorPassword();
console.log(`The password to the door is:`, { safeDoorPassword });
