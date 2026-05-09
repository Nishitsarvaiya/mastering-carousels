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
		};
		this.pathWidth = (this.slides.length - 1) * 5 + 6;
		this.init();
	}

	init() {
		console.log('Carousel initialised');
		gsap.set(this.track, { 'scroll-snap-type': 'none', overflow: 'hidden' });
		gsap.set(this.nav, { display: 'block' });
		gsap.set('.carousel-progress', { attr: { viewBox: '-1 -1 ' + (this.pathWidth + 2) + ' 2' } });
		gsap.set('.carousel-progress path', { attr: { d: 'M0,0 ' + this.pathWidth + ',0' } });
		this.updateProgress(0, 0);

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
				this.updateProgress(index);
			},
		});

		// each slide can function as a button to activate itself
		this.slides.forEach((slide, i) => {
			gsap.set(slide, { opacity: i === 0 ? 1 : 0.7 });
			slide.addEventListener('click', () => this.loop.toIndex(i, { duration: 1, ease: 'expo' }));
		});

		this.loop.toIndex(0, { duration: 0 });
		slideImgUpdate(this.slides);

		Observer.create({
			target: '.carousel',
			type: 'wheel',
			onLeft: (o) => {
				if (!gsap.isTweening(this.loop) && o.deltaX < -4) this.loop.next({ duration: 1.2, ease: 'power3.out' });
			},
			onRight: (o) => {
				if (!gsap.isTweening(this.loop) && o.deltaX > 4) this.loop.previous({ duration: 1.2, ease: 'power3.out' });
			},
		});
	}

	updateProgress(index, dur) {
		let str = '';
		for (let i = 0; i < this.slides.length; i++) {
			str += i == index ? 6 : 0.5;
			str += ' ' + 4.5 + ' ';
		}
		gsap.to('.carousel-progress path', {
			duration: dur == null ? 0.5 : dur,
			attr: { 'stroke-dasharray': str },
		});
	}
}
