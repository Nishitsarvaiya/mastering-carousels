import gsap from 'gsap';
import { horizontalLoop, slideImgUpdate } from './utils';

export default class Carousel {
	constructor() {
		this.el = document.querySelector('.carousel');
		this.track = this.el.querySelector('.carousel-track');
		this.nav = this.el.querySelector('.carousel-nav');
		this.slides = this.el.querySelectorAll('.carousel-item');
		this.prevBtn = this.nav.querySelector('.carousel-prev');
		this.nextBtn = this.nav.querySelector('.carousel-next');
		this.state = {
			activeSlide: null,
			firstTime: true,
		};
		this.init();
	}

	init() {
		console.log('Carousel initialised');
		gsap.set(this.track, { 'scroll-snap-type': 'none', overflow: 'visible' });
		gsap.set(this.nav, { display: 'block' });

		this.createCarousel();
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.nextBtn.addEventListener('click', () => this.loop.next({ duration: 1.6, ease: 'power3.out' }));
		this.prevBtn.addEventListener('click', () => this.loop.previous({ duration: 1.6, ease: 'power3.out' }));
	}

	createCarousel() {
		this.loop = horizontalLoop(this.slides, {
			paused: true, // no auto-scroll
			paddingRight: 10, // match the 10px flex gap
			center: true, // snap the active slide to the center
			draggable: true, // enable dragging
			onChange: (slide, index) => {
				console.log(slide, index);
				if (this.state.activeSlide) {
					gsap.to('.--active', { opacity: 0.7 });
					this.state.activeSlide.classList.remove('--active');
				}
				slide.classList.add('--active');
				this.state.activeSlide = slide;
				gsap.timeline()
					.to('.--active', {
						opacity: 1,
						ease: 'power2.inOut',
					})
					.progress(this.state.firstTime ? 1 : 0);
			},
		});

		// each slide can function as a button to activate itself
		this.slides.forEach((slide, i) => {
			gsap.set(slide, { opacity: i === 0 ? 1 : 0.7 });
			slide.addEventListener('click', () => this.loop.toIndex(i, { duration: 1, ease: 'expo' }));
		});

		this.loop.toIndex(0, { duration: 0 });
		this.state.firstTime = false;
	}
}
