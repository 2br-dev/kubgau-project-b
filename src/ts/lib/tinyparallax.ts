export default class TinyParallax {

	selector:string;
	offset:number;
	processId:number | null = null;

	getElemTop(el:HTMLElement){
		const rect = el.getBoundingClientRect();
		const doc = el.ownerDocument;
		const win = doc.defaultView;
		const docElem = doc.documentElement;

		if(win != null){
			return rect.top + win.pageYOffset - docElem.clientTop
		}else{
			return 0;
		}
		
	}

	setBackgroundPosition(){
		// debugger;
		document.querySelectorAll(this.selector).forEach((el: Element) => {
			const element = el as HTMLElement;
			const elTop = this.getElemTop(element);
			const pos = ((elTop - this.offset + el.clientHeight / 2 - window.scrollY) / window.innerHeight) * 100 + "%";
			element.style.backgroundPosition = "center " + pos
		});

		this.processId = requestAnimationFrame(this.setBackgroundPosition.bind(this));
	}

	constructor(selector: string, offset:number = 0) {
		this.selector = selector;
		this.offset = offset;
		window.addEventListener("scroll", this.setBackgroundPosition.bind(this));
		this.setBackgroundPosition();
	}
}
