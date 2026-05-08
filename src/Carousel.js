import gsap from 'gsap';

export default class Carousel {
	constructor() {
		this.el = document.querySelector('.carousel');
		this.track = this.el.querySelector('.carousel-track');
		this.nav = this.el.querySelector('.carousel-nav');
		this.slides = this.el.querySelectorAll('.carousel-item');
		this.prevBtn = this.nav.querySelector('.carousel-prev');
		this.nextBtn = this.nav.querySelector('.carousel-next');
		this.state = {
			currentSlide: 0,
			totalSlides: this.slides.length,
		};
		this.init();
	}

	init() {
		console.log('Carousel initialised');
		gsap.set(this.el, { 'scroll-snap-type': 'none' });
		gsap.set(this.nav, { display: 'block' });

		this.slides.forEach((slide, idx) => {
			slide.classList.add('--abs');
			gsap.set(slide, { opacity: idx === 0 ? 1 : 0 });
		});

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.nextBtn.addEventListener('click', () => this.changeSlide(1));
		this.prevBtn.addEventListener('click', () => this.changeSlide(-1));
	}

	changeSlide(direction) {
		gsap.to(this.slides[this.state.currentSlide], {
			opacity: 0,
			duration: 0.5,
			ease: 'expo.out',
		});

		this.state.currentSlide = gsap.utils.wrap(0, this.state.totalSlides, this.state.currentSlide + direction);

		gsap.to(this.slides[this.state.currentSlide], {
			opacity: 1,
			duration: 0.5,
			ease: 'expo.out',
		});
	}
}
