import justDebounce from 'just-debounce';

export type CSSAutoScaleOptions = {
	debounce?: number;
	/**
		If `true`, creates a wrapper element around the element and applies the CSS transformation on the wrapper element. If `false`, applies the CSS transformation directory on the element.

		@default true
	 */
	useWrapper?: boolean;
};

type ElementWithStyle = Element & ElementCSSInlineStyle;

export function cssAutoScale(
	elementOrSelector: string | ElementWithStyle,
	{ debounce = 250, useWrapper = true }: CSSAutoScaleOptions = {}
) {
	let element: ElementWithStyle;
	if (typeof elementOrSelector === 'string') {
		const documentElement =
			document.querySelector<ElementWithStyle>(elementOrSelector);
		if (documentElement === null) {
			throw new Error(`Element ${elementOrSelector} not found.`);
		}

		if (documentElement.style === undefined) {
			throw new Error('Element must have a `style` attribute.');
		}

		element = documentElement;
	} else {
		element = elementOrSelector;
	}

	if (useWrapper) {
		const wrapperElement = document.createElement('div');
		element.insertBefore(wrapperElement, null);
		element = wrapperElement;
	}

	// In order to add a CSS transform without modifying the

	window.addEventListener('resize', () => {
		justDebounce(() => {
			const windowWidth = window.innerWidth;
			const elementWidth = element.getBoundingClientRect().width;

			if (elementWidth > windowWidth) {
				element.style.transform = 'scaleX()';
			}
		}, debounce);
	});
}
