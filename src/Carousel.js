import gsap from 'gsap';
import { horizontalLoop, slideImgUpdate } from './utils';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

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
			activeIndex: 0,
		};
		this.pathWidth = (this.slides.length - 1) * 5 + 6;
		this.init();
	}

	init() {
		console.log('Carousel initialised');
		gsap.set(this.track, { 'scroll-snap-type': 'none', overflow: 'visible' });
		gsap.set(this.nav, { display: 'block' });
		gsap.set(this.slides, {
			perspective: 999,
			transformOrigin: '50% 50% 0',
			transformStyle: 'preserve-3d',
			willChange: 'transform,opacity',
		});
		gsap.set('.carousel-progress', { display: 'block', attr: { viewBox: '-1 -1 ' + (this.pathWidth + 2) + ' 2' } });
		gsap.set('.carousel-progress path', { attr: { d: 'M0,0 ' + this.pathWidth + ',0' } });
		this.updateProgress(0);

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
				this.state.activeSlide && this.state.activeSlide.classList.remove('active');
				slide.classList.add('active');
				this.state.activeSlide = slide;
				this.state.activeIndex = index;
				this.updateProgress();
			},
		});

		// each slide can function as a button to activate itself
		this.slides.forEach((slide, i) => {
			const imgWrapper = slide.querySelector('.carousel-item__inner');

			imgWrapper.addEventListener('click', () => {
				this.loop.toIndex(i, { duration: 1.6, ease: 'power3.out' });
			});

			imgWrapper.addEventListener('pointerover', () => {
				gsap.to('.carousel-item img', {
					opacity: (i, t) => (t === slide.querySelector('img') ? 1 : 0.5),
					duration: 0.3,
					ease: 'power1.inOut',
				});
			});

			imgWrapper.addEventListener('pointerout', () => {
				gsap.to('.carousel-item img', { opacity: 1, duration: 0.3, ease: 'power1.inOut' });
			});
		});

		this.loop.toIndex(0, { duration: 0 });

		Observer.create({
			target: '.carousel',
			type: 'wheel',
			onLeft: (o) => {
				if (!gsap.isTweening(this.loop) && o.deltaX < -4) this.loop.next({ duration: 1.6, ease: 'power3.out' });
			},
			onRight: (o) => {
				if (!gsap.isTweening(this.loop) && o.deltaX > 4) this.loop.previous({ duration: 1.6, ease: 'power3.out' });
			},
		});
	}

	// sets svg path appearance to show carousel progress
	updateProgress(dur) {
		let str = '';
		for (let i = 0; i < this.slides.length; i++) {
			str += i === this.state.activeIndex ? 6 : 0.5;
			str += ' ' + 4.5 + ' ';
		}
		gsap.to('.carousel-progress path', {
			duration: dur == null ? 0.5 : dur,
			attr: { 'stroke-dasharray': str },
		});
	}
}
