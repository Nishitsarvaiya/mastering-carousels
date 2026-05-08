import Carousel from './Carousel';

const initApp = async () => {
	try {
		await Promise.all([
			new Promise((resolve) => {
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', resolve);
				} else {
					resolve();
				}
			}),
			document.fonts.ready,
		]);

		new Carousel();
	} catch (err) {
		console.error('Carousel initialisation failed!', err);
	}
};

initApp();
