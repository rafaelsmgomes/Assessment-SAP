export default class TipsScheme{
  constructor(attr) {       
  	this.divActivate = attr.divActivate;
  	this.schemeObj = attr.schemeObj;
  }

	changeTips(){		
		for(const component in this.schemeObj){
			const ele = $(this.divActivate).find(component)[0];

			component === '.landing__container' ? $('.header__rectangle--2').removeClass('header__rectangle--activate') : $('.header__rectangle--2').addClass('header__rectangle--activate');
			if(ele){			
				$('.grow--text--1').text(this.schemeObj[component]);	
				break;
			}
		}
	}  
};
