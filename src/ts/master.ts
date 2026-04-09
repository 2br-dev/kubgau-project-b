import Lazy from 'vanilla-lazyload';
import Parallax from './lib/tinyparallax';
import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';
import M from 'materialize-css';

declare var ymaps: any;

Swiper.use([Pagination, Navigation]);
let sidenav: M.Sidenav[];

document.addEventListener('DOMContentLoaded', () => {
	const lazy = new Lazy({}, document.querySelectorAll('.lazy'));
	const parallax = new Parallax('#parallax');

	const carrierSwiper = document.querySelectorAll('#carrier-slider').length ?
	new Swiper('#carrier-slider', {
		navigation: {
			prevEl: '.carrier-prev',
			nextEl: '.carrier-next'
		},
		pagination: {
			type: 'fraction',
			el: '.fractions'
		},
		on: {
			'slideChange': () => {
				const section = document.querySelector('#carrier') as HTMLElement;

				if(section)
				{
					const top = section.offsetTop;
					document.documentElement.scrollTop = top + 30;
				}
			}
		}
	}): null;

	sidenav = M.Sidenav.init(document.querySelectorAll('.sidenav'), {
		edge: 'right',
	});

	document.querySelectorAll('.sidenav a').forEach(el => {
		el.addEventListener('click', () => sidenav[0].close())
	})

	const year = new Date().getFullYear();
	const yearEl = document.querySelector('#year') as HTMLElement;

	if(yearEl){
		yearEl.textContent = year.toString();
	}

	initMap();

	document.onscroll = updateFab;

	initMouseParallax();
})

function initMouseParallax()
{
	window.addEventListener('mousemove', (e:MouseEvent) => {
		const level1 = document.querySelector('.level1') as HTMLElement;
		const level2 = document.querySelector('.level2') as HTMLElement;

		if(level1 && level2){
			MouseParallax(level1, 120, e.clientX, e.clientY);
			MouseParallax(level2, -70, e.clientX, e.clientY);
		}
	});
}

function MouseParallax(el:HTMLElement, offset:number, mouseX: number, mouseY: number)
{
	const x = mouseX / window.innerWidth;
	const y = mouseY / window.innerHeight;

	const translateX = (x * offset);
	const translateY = (y * offset);

	el.style.transform = `translate(${translateX}px, ${translateY}px)`;
}

function updateFab()
{
	const scrollTop = document.documentElement.scrollTop;
	const fab = document.querySelector('.fab');

	if(!fab) return;

	if(scrollTop > window.innerHeight / 2)
	{
		fab.classList.add('visible');
	}else{
		fab.classList.remove('visible');
	}
}

function initMap()
{
	loadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', () => {
		
		ymaps.ready(() => {

			const coords = [45.046736, 38.928481];

			const map = new ymaps.Map('map', {
				center: coords,
				zoom: 16
			})

			const marker = new ymaps.Placemark(coords);

			marker.options.set('iconLayout', 'default#image');
			marker.options.set('iconImageHref', '../project-b/img/yandex-marker.svg');

			marker.events.add('click', (e:any) => {
				const url = "https://yandex.ru/maps/35/krasnodar/?ll=38.930217%2C45.045233&mode=routes&rtext=~45.046736%2C38.928481&rtt=mt&ruri=~&z=15.6";
				window.open(url, '_blank');
			});

			map.behaviors.disable('scrollZoom');

			map.geoObjects.add(marker);
		})
	})
}

function loadScript(url: string, callback: () => any) {
	let script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.onload = callback;
	document.body.appendChild(script);

	if ((script as any).readyState) {
		//IE
		(script as any).onreadystatechange = function () {
			if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
				(script as any).onreadystatechange = null;
				callback();
			}
		};
	} else {
		script.onload = callback;
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}